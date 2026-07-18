"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole, ROLES, APPOINTMENT_STATUS, PAYMENT_METHODS } from "@/lib/rbac";
import { notifyPaymentReceipt } from "@/lib/notify";

const staff = () => requireRole(ROLES.ADMIN, ROLES.OWNER);
const VALID = Object.values(APPOINTMENT_STATUS);
const METHODS = Object.values(PAYMENT_METHODS);

export async function adminChangeStatus(formData: FormData) {
  const session = await staff();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!VALID.includes(status as (typeof VALID)[number])) return;
  const appt = await prisma.appointment.findFirst({ where: { id, tenantId: session.tenantId } });
  if (appt) await prisma.appointment.update({ where: { id }, data: { status } });
  revalidatePath("/panel/admin/citas");
}

export async function adminReassignBarber(formData: FormData) {
  const session = await staff();
  const id = String(formData.get("id") ?? "");
  const barberId = String(formData.get("barberId") ?? "");
  const [appt, barber] = await Promise.all([
    prisma.appointment.findFirst({ where: { id, tenantId: session.tenantId } }),
    prisma.barberProfile.findFirst({ where: { id: barberId, tenantId: session.tenantId } }),
  ]);
  if (appt && barber) await prisma.appointment.update({ where: { id }, data: { barberId } });
  revalidatePath("/panel/admin/citas");
}

/**
 * Registra el pago de una cita (efectivo/tarjeta/PSE/Nequi/Daviplata) y genera
 * el comprobante. Para pasarelas reales (Stripe/Mercado Pago) se conecta el SDK
 * con sus llaves; aquí queda el registro manual, que la barbería siempre necesita.
 */
export async function registerPayment(formData: FormData) {
  const session = await staff();
  const id = String(formData.get("id") ?? "");
  const method = String(formData.get("method") ?? "");
  if (!METHODS.includes(method as (typeof METHODS)[number])) return;

  const appt = await prisma.appointment.findFirst({
    where: { id, tenantId: session.tenantId },
    include: { payment: true, client: true, service: true },
  });
  if (!appt || appt.payment) return;

  const reference = `CMP-${Date.now().toString(36).toUpperCase()}`;
  await prisma.payment.create({
    data: { tenantId: session.tenantId, appointmentId: id, method, amountCents: appt.priceCents, status: "PAID", reference },
  });
  // Marca completada si aún no lo estaba.
  if (appt.status !== APPOINTMENT_STATUS.COMPLETED) {
    await prisma.appointment.update({ where: { id }, data: { status: APPOINTMENT_STATUS.COMPLETED } });
  }
  await notifyPaymentReceipt(appt.client.email, `${appt.client.firstName}`, appt.service.name, appt.priceCents, reference);
  revalidatePath("/panel/admin/citas");
}
