"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole, ROLES } from "@/lib/rbac";

export async function updateCommission(formData: FormData) {
  const session = await requireRole(ROLES.ADMIN, ROLES.OWNER);
  const id = String(formData.get("id") ?? "");
  const pct = Math.max(0, Math.min(100, Math.round(Number(formData.get("pct") ?? 0))));
  const prof = await prisma.barberProfile.findFirst({ where: { id, tenantId: session.tenantId } });
  if (prof) await prisma.barberProfile.update({ where: { id }, data: { commissionPct: pct } });
  revalidatePath("/panel/admin/comisiones");
}
