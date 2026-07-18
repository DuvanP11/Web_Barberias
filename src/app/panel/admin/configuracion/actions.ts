"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, ROLES } from "@/lib/rbac";

const schema = z.object({
  name: z.string().min(1),
  primaryColor: z.string().optional(),
});

export type ConfigState = { ok?: boolean };

export async function updateTenant(_prev: ConfigState, formData: FormData): Promise<ConfigState> {
  const session = await requireRole(ROLES.ADMIN, ROLES.OWNER);
  const p = schema.safeParse(Object.fromEntries(formData));
  if (!p.success) return {};
  await prisma.tenant.update({
    where: { id: session.tenantId },
    data: { name: p.data.name, primaryColor: p.data.primaryColor || null },
  });
  revalidatePath("/panel/admin/configuracion");
  return { ok: true };
}
