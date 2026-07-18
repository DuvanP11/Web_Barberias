"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, ROLES } from "@/lib/rbac";

const svcSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  durationMin: z.coerce.number().int().min(5),
  category: z.string().optional(),
});

async function staff() {
  return requireRole(ROLES.ADMIN, ROLES.OWNER);
}

export async function createService(formData: FormData) {
  const session = await staff();
  const p = svcSchema.safeParse(Object.fromEntries(formData));
  if (!p.success) return;
  const { name, description, price, durationMin, category } = p.data;
  await prisma.service.create({
    data: { tenantId: session.tenantId, name, description: description || null, priceCents: Math.round(price * 100), durationMin, category: category || null },
  });
  revalidatePath("/panel/admin/servicios");
}

export async function updateService(formData: FormData) {
  const session = await staff();
  const id = String(formData.get("id") ?? "");
  const p = svcSchema.safeParse(Object.fromEntries(formData));
  if (!p.success || !id) return;
  const { name, description, price, durationMin, category } = p.data;
  await prisma.service.updateMany({
    where: { id, tenantId: session.tenantId },
    data: { name, description: description || null, priceCents: Math.round(price * 100), durationMin, category: category || null },
  });
  revalidatePath("/panel/admin/servicios");
}

export async function toggleService(formData: FormData) {
  const session = await staff();
  const id = String(formData.get("id") ?? "");
  const svc = await prisma.service.findFirst({ where: { id, tenantId: session.tenantId } });
  if (svc) await prisma.service.update({ where: { id }, data: { active: !svc.active } });
  revalidatePath("/panel/admin/servicios");
}

export async function deleteService(formData: FormData) {
  const session = await staff();
  const id = String(formData.get("id") ?? "");
  const svc = await prisma.service.findFirst({ where: { id, tenantId: session.tenantId } });
  if (!svc) return;
  const used = await prisma.appointment.count({ where: { serviceId: id } });
  // Si tiene historial, se archiva (desactiva) para no romper las citas.
  if (used > 0) await prisma.service.update({ where: { id }, data: { active: false } });
  else await prisma.service.delete({ where: { id } });
  revalidatePath("/panel/admin/servicios");
}
