"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole, ROLES, APPOINTMENT_STATUS } from "@/lib/rbac";

export async function cancelAppointment(formData: FormData) {
  const session = await requireRole(ROLES.CLIENT);
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/panel/cliente/citas");

  const appt = await prisma.appointment.findFirst({
    where: { id, clientId: session.uid, tenantId: session.tenantId },
  });
  if (appt && appt.status !== APPOINTMENT_STATUS.COMPLETED) {
    await prisma.appointment.update({
      where: { id },
      data: { status: APPOINTMENT_STATUS.CANCELLED },
    });
  }
  redirect("/panel/cliente/citas?cancel=1");
}
