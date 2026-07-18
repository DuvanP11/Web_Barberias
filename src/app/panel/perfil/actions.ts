"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";

const schema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio."),
  lastName: z.string().min(1, "El apellido es obligatorio."),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  address: z.string().optional(),
});

export type ProfileState = { ok?: boolean; error?: string };

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await requireSession();

  const parsed = schema.safeParse({
    firstName: String(formData.get("firstName") ?? "").trim(),
    lastName: String(formData.get("lastName") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim() || undefined,
    birthDate: String(formData.get("birthDate") ?? "").trim() || undefined,
    address: String(formData.get("address") ?? "").trim() || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Revisa los datos." };

  const { firstName, lastName, phone, birthDate, address } = parsed.data;
  let birth: Date | null = null;
  if (birthDate) {
    const d = new Date(`${birthDate}T00:00:00`);
    if (!Number.isNaN(d.getTime())) birth = d;
  }

  await prisma.user.update({
    where: { id: session.uid },
    data: { firstName, lastName, phone: phone ?? null, birthDate: birth, address: address ?? null },
  });

  return { ok: true };
}
