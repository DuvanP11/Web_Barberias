"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { requireRole, ROLES, isRole } from "@/lib/rbac";

const staff = () => requireRole(ROLES.ADMIN, ROLES.OWNER);

const createSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.enum(["BARBER", "ADMIN", "OWNER"]),
  password: z.string().min(8),
});

export async function createStaff(formData: FormData) {
  const session = await staff();
  const p = createSchema.safeParse(Object.fromEntries(formData));
  if (!p.success) return;
  // Solo el dueño puede crear otros dueños.
  if (p.data.role === "OWNER" && session.role !== ROLES.OWNER) return;

  const email = p.data.email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { tenantId_email: { tenantId: session.tenantId, email } } });
  if (exists) return;

  const user = await prisma.user.create({
    data: {
      tenantId: session.tenantId, role: p.data.role, firstName: p.data.firstName, lastName: p.data.lastName,
      email, phone: p.data.phone || null, passwordHash: hashPassword(p.data.password), emailVerified: new Date(),
    },
  });
  if (p.data.role === "BARBER") {
    await prisma.barberProfile.create({ data: { tenantId: session.tenantId, userId: user.id, specialty: "Barbero", experienceYears: 1, commissionPct: 50 } });
  }
  revalidatePath("/panel/admin/usuarios");
}

export async function toggleUserActive(formData: FormData) {
  const session = await staff();
  const id = String(formData.get("id") ?? "");
  if (id === session.uid) return; // no bloquearse a sí mismo
  const u = await prisma.user.findFirst({ where: { id, tenantId: session.tenantId } });
  if (u) await prisma.user.update({ where: { id }, data: { active: !u.active } });
  revalidatePath("/panel/admin/usuarios");
}

export async function changeUserRole(formData: FormData) {
  const session = await staff();
  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "");
  if (!isRole(role) || id === session.uid) return;
  if (role === "OWNER" && session.role !== ROLES.OWNER) return;

  const u = await prisma.user.findFirst({ where: { id, tenantId: session.tenantId } });
  if (!u) return;
  await prisma.user.update({ where: { id }, data: { role } });
  if (role === "BARBER") {
    const prof = await prisma.barberProfile.findUnique({ where: { userId: id } });
    if (!prof) await prisma.barberProfile.create({ data: { tenantId: session.tenantId, userId: id, specialty: "Barbero", experienceYears: 1, commissionPct: 50 } });
    else if (!prof.active) await prisma.barberProfile.update({ where: { id: prof.id }, data: { active: true } });
  }
  revalidatePath("/panel/admin/usuarios");
}
