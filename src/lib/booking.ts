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

  const open = new Date(`${date}T${pad(OPEN_HOUR)}:00:00`);
  const close = new Date(`${date}T${pad(CLOSE_HOUR)}:00:00`);
  if (Number.isNaN(open.getTime())) return [];
  if (open.getDay() === CLOSED_WEEKDAY) return []; // cerrado ese día

  const durationMs = service.durationMin * 60000;
  const stepMs = SLOT_STEP_MIN * 60000;
  const now = new Date();

  // Citas del barbero ese día (para marcar ocupados sin una consulta por cupo).
  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59`);
  const busy = await prisma.appointment.findMany({
    where: { tenantId, barberId, status: { in: BUSY }, startAt: { gte: dayStart, lte: dayEnd } },
    select: { startAt: true, endAt: true },
  });

  const slots: Slot[] = [];
  for (let t = open.getTime(); t + durationMs <= close.getTime() + 1; t += stepMs) {
    const start = new Date(t);
    const end = new Date(t + durationMs);
    const inFuture = start.getTime() > now.getTime();
    const overlaps = busy.some((b) => start < b.endAt && end > b.startAt);
    slots.push({
      time: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
      iso: start.toISOString(),
      available: inFuture && !overlaps,
    });
  }
  return slots;
}
