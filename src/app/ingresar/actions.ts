"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma, hasDatabase } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { setSession } from "@/lib/auth";
import { panelHome } from "@/lib/rbac";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type AuthState = { error?: string };

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!hasDatabase) {
    return { error: "La base de datos no está configurada. Revisa el README para conectarla." };
  }

  const parsed = schema.safeParse({
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) return { error: "Ingresa un correo y una contraseña válidos." };

  const { email, password } = parsed.data;
  const user = await prisma.user.findFirst({
    where: { email, active: true },
    include: { tenant: true },
  });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Correo o contraseña incorrectos." };
  }

  await setSession({
    id: user.id,
    tenantId: user.tenantId,
    tenantSlug: user.tenant.name,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    role: user.role,
  });

  redirect(panelHome(user.role));
}
