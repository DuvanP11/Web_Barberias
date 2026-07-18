"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, ROLES, APPOINTMENT_STATUS } from "@/lib/rbac";
import { isSlotFree } from "@/lib/booking";
import { notifyAppointmentConfirmed } from "@/lib/notify";

const schema = z.object({
  locationId: z.string().min(1),
  serviceId: z.string().min(1),
  barberId: z.string().min(1),
  startIso: z.string().min(1),
  rescheduleId: z.string().optional(),
});

export type BookingState = { error?: string };

export async function submitBooking(_prev: BookingState, formData: FormData): Promise<BookingState> {
  const session = await requireRole(ROLES.CLIENT);

  const parsed = schema.safeParse({
    locationId: String(formData.get("locationId") ?? ""),
    serviceId: String(formData.get("serviceId") ?? ""),
    barberId: String(formData.get("barberId") ?? ""),
    startIso: String(formData.get("startIso") ?? ""),
    rescheduleId: String(formData.get("rescheduleId") ?? "") || undefined,
  });
  if (!parsed.success) return { error: "Elige sede, servicio, barbero, fecha y hora." };
  const { locationId, serviceId, barberId, startIso, rescheduleId } = parsed.data;

  const start = new Date(startIso);
  if (Number.isNaN(start.getTime()) || start.getTime() <= Date.now()) {
    return { error: "Elige un horario válido a futuro." };
  }

  const service = await prisma.service.findFirst({
    where: { id: serviceId, tenantId: session.tenantId, active: true },
  });
  if (!service) return { error: "Servicio no válido." };
  const end = new Date(start.getTime() + service.durationMin * 60000);

  const [location, barber] = await Promise.all([
    prisma.location.findFirst({ where: { id: locationId, tenantId: session.tenantId, active: true } }),
    prisma.barberProfile.findFirst({ where: { id: barberId, tenantId: session.tenantId, active: true } }),
  ]);
  if (!location || !barber) return { error: "Sede o barbero no válido." };

  // Revalidación anti-carrera: el cupo pudo ocuparse mientras el cliente elegía.
  const free = await isSlotFree(session.tenantId, barberId, start, end, rescheduleId);
  if (!free) return { error: "Ese horario acaba de ocuparse. Elige otro, por favor." };

  if (rescheduleId) {
    const own = await prisma.appointment.findFirst({
      where: { id: rescheduleId, clientId: session.uid, tenantId: session.tenantId },
    });
    if (!own) return { error: "No encontramos esa cita." };
    await prisma.appointment.update({
      where: { id: rescheduleId },
      data: { locationId, serviceId, barberId, startAt: start, endAt: end, priceCents: service.priceCents, status: APPOINTMENT_STATUS.CONFIRMED },
    });
  } else {
    await prisma.appointment.create({
      data: {
        tenantId: session.tenantId,
        locationId,
        clientId: session.uid,
        barberId,
        serviceId,
        startAt: start,
        endAt: end,
        priceCents: service.priceCents,
        status: APPOINTMENT_STATUS.CONFIRMED,
      },
    });
    // Fidelización: +10 puntos por agendar.
    await prisma.user.update({ where: { id: session.uid }, data: { points: { increment: 10 } } });
    // Notificación de confirmación (degrada a registro si no hay proveedor).
    await notifyAppointmentConfirmed(session.email, session.name ?? "cliente", service.name, start);
  }

  redirect("/panel/cliente/citas?ok=1");
}
