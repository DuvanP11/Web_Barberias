"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole, ROLES, APPOINTMENT_STATUS } from "@/lib/rbac";
import { getBarberProfileForSession } from "@/lib/barber";

async function ownAppointment(session: Awaited<ReturnType<typeof requireRole>>, id: string) {
  const profile = await getBarberProfileForSession(session);
  if (!profile) return null;
  const appt = await prisma.appointment.findFirst({ where: { id, barberId: profile.id, tenantId: session.tenantId } });
  return appt;
}

export async function completeAppointment(formData: FormData) {
  const session = await requireRole(ROLES.BARBER);
  const id = String(formData.get("id") ?? "");
  const appt = await ownAppointment(session, id);
  if (appt && appt.status !== APPOINTMENT_STATUS.CANCELLED) {
    await prisma.appointment.update({ where: { id }, data: { status: APPOINTMENT_STATUS.COMPLETED } });
    // Fidelización del cliente: +20 puntos por servicio completado.
    await prisma.user.update({ where: { id: appt.clientId }, data: { points: { increment: 20 } } });
  }
  revalidatePath("/panel/barbero/agenda");
}

export async function cancelBarberAppointment(formData: FormData) {
  const session = await requireRole(ROLES.BARBER);
  const id = String(formData.get("id") ?? "");
  const appt = await ownAppointment(session, id);
  if (appt && appt.status !== APPOINTMENT_STATUS.COMPLETED) {
    await prisma.appointment.update({ where: { id }, data: { status: APPOINTMENT_STATUS.CANCELLED } });
  }
  revalidatePath("/panel/barbero/agenda");
}
