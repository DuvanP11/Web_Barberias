"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, ROLES } from "@/lib/rbac";

const schema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  mapQuery: z.string().optional(),
  schedule: z.string().optional(),
  parking: z.string().optional(),
});

const staff = () => requireRole(ROLES.ADMIN, ROLES.OWNER);
const fields = (p: z.infer<typeof schema>) => ({
  name: p.name,
  address: p.address || null,
  phone: p.phone || null,
  whatsapp: p.whatsapp || null,
  mapQuery: p.mapQuery || null,
  schedule: p.schedule || null,
  parking: p.parking === "on",
});

export async function createLocation(formData: FormData) {
  const session = await staff();
  const p = schema.safeParse(Object.fromEntries(formData));
  if (!p.success) return;
  await prisma.location.create({ data: { tenantId: session.tenantId, ...fields(p.data) } });
  revalidatePath("/panel/admin/sedes");
}

export async function updateLocation(formData: FormData) {
  const session = await staff();
  const id = String(formData.get("id") ?? "");
  const p = schema.safeParse(Object.fromEntries(formData));
  if (!p.success || !id) return;
  await prisma.location.updateMany({ where: { id, tenantId: session.tenantId }, data: fields(p.data) });
  revalidatePath("/panel/admin/sedes");
}

export async function toggleLocation(formData: FormData) {
  const session = await staff();
  const id = String(formData.get("id") ?? "");
  const loc = await prisma.location.findFirst({ where: { id, tenantId: session.tenantId } });
  if (loc) await prisma.location.update({ where: { id }, data: { active: !loc.active } });
  revalidatePath("/panel/admin/sedes");
}
