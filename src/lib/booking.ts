import "server-only";
import { prisma } from "./prisma";
import { APPOINTMENT_STATUS } from "./roles";

/**
 * Motor de disponibilidad de citas.
 *
 * Horario del negocio (configurable). Un cupo está disponible si cae dentro del
 * horario, no está en el pasado y no se solapa con otra cita del MISMO barbero.
 * Nota: usa la hora local del servidor; en producción con Postgres/UTC conviene
 * fijar la zona horaria del negocio.
 */
export const OPEN_HOUR = 9; // 9:00 a.m.
export const CLOSE_HOUR = 20; // 8:00 p.m.
export const SLOT_STEP_MIN = 30;
export const CLOSED_WEEKDAY = 1; // lunes (0 = domingo)

// Zona horaria del negocio anclada por desfase fijo (Colombia no tiene horario
// de verano). Así los cupos son correctos aunque el servidor corra en UTC
// (Vercel) — no dependemos de la variable de entorno TZ.
export const TZ_OFFSET = "-05:00";

// Estados que OCUPAN un cupo (una cita cancelada libera el horario).
const BUSY = [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.CONFIRMED, APPOINTMENT_STATUS.COMPLETED];

export type Slot = { time: string; iso: string; available: boolean };

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** ¿Está libre el rango [start, end) para ese barbero? (excluye una cita opcional). */
export async function isSlotFree(
  tenantId: string,
  barberId: string,
  start: Date,
  end: Date,
  excludeAppointmentId?: string,
): Promise<boolean> {
  const overlap = await prisma.appointment.findFirst({
    where: {
      tenantId,
      barberId,
      status: { in: BUSY },
      id: excludeAppointmentId ? { not: excludeAppointmentId } : undefined,
      // Se solapan si empiezan antes de que termine la otra y terminan después de que empiece.
      startAt: { lt: end },
      endAt: { gt: start },
    },
    select: { id: true },
  });
  return !overlap;
}

/**
 * Cupos del día para (barbero, servicio). `date` = "YYYY-MM-DD".
 * Devuelve todos los cupos del horario marcando cuáles están disponibles.
 */
export async function getAvailability(
  tenantId: string,
  barberId: string,
  serviceId: string,
  date: string,
): Promise<Slot[]> {
  const service = await prisma.service.findFirst({
    where: { id: serviceId, tenantId, active: true },
    select: { durationMin: true },
  });
  if (!service) return [];

  // Día de la semana de esa fecha (mediodía UTC = misma fecha calendario).
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  if (Number.isNaN(weekday)) return [];
  if (weekday === CLOSED_WEEKDAY) return []; // cerrado ese día

  const durationMin = service.durationMin;
  const now = Date.now();

  // Rango del día EN HORA DE COLOMBIA (con el desfase fijo), para filtrar citas.
  const dayStart = new Date(`${date}T00:00:00${TZ_OFFSET}`);
  const dayEnd = new Date(`${date}T23:59:59${TZ_OFFSET}`);
  const busy = await prisma.appointment.findMany({
    where: { tenantId, barberId, status: { in: BUSY }, startAt: { gte: dayStart, lte: dayEnd } },
    select: { startAt: true, endAt: true },
  });

  const slots: Slot[] = [];
  // Se itera en minutos del reloj de Colombia; el instante real lleva el desfase.
  for (let m = OPEN_HOUR * 60; m + durationMin <= CLOSE_HOUR * 60; m += SLOT_STEP_MIN) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    const start = new Date(`${date}T${pad(h)}:${pad(mm)}:00${TZ_OFFSET}`);
    const end = new Date(start.getTime() + durationMin * 60000);
    const inFuture = start.getTime() > now;
    const overlaps = busy.some((b) => start < b.endAt && end > b.startAt);
    slots.push({ time: `${pad(h)}:${pad(mm)}`, iso: start.toISOString(), available: inFuture && !overlaps });
  }
  return slots;
}
