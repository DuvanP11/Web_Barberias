"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma, hasDatabase } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { setSession } from "@/lib/auth";
import { ROLES } from "@/lib/rbac";

const schema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio."),
  lastName: z.string().min(1, "El apellido es obligatorio."),
  email: z.string().email("Correo inválido."),
  phone: z.string().optional(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

export type AuthState = { error?: string };

export async function register(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!hasDatabase) {
    return { error: "La base de datos no está configurada. Revisa el README para conectarla." };
  }

  const parsed = schema.safeParse({
    firstName: String(formData.get("firstName") ?? "").trim(),
    lastName: String(formData.get("lastName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    phone: String(formData.get("phone") ?? "").trim() || undefined,
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los datos del formulario." };
  }
  const { firstName, lastName, email, phone, password } = parsed.data;

  // La barbería (tenant) sobre la que se registra el cliente. En esta fundación
  // se usa la primera activa; el enrutado por subdominio/multi-negocio llega después.
  const tenant = await prisma.tenant.findFirst({ where: { active: true } });
  if (!tenant) return { error: "Todavía no hay una barbería configurada." };

  const existing = await prisma.user.findUnique({
    where: { tenantId_email: { tenantId: tenant.id, email } },
  });
  if (existing) return { error: "Ese correo ya está registrado." };

  const user = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      role: ROLES.CLIENT,
      firstName,
      lastName,
      email,
      phone,
      passwordHash: hashPassword(password),
    },
  });

  await setSession({
    id: user.id,
    tenantId: tenant.id,
    tenantSlug: tenant.name,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    role: user.role,
  });

  redirect("/panel/cliente");
}
