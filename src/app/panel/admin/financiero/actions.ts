"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, ROLES } from "@/lib/rbac";

const staff = () => requireRole(ROLES.ADMIN, ROLES.OWNER);

const schema = z.object({
  concept: z.string().min(1),
  category: z.string().optional(),
  amount: z.coerce.number().min(0),
  locationId: z.string().optional(),
});

export async function addExpense(formData: FormData) {
  const session = await staff();
  const p = schema.safeParse(Object.fromEntries(formData));
  if (!p.success) return;
  await prisma.expense.create({
    data: {
      tenantId: session.tenantId,
      concept: p.data.concept,
      category: p.data.category || null,
      amountCents: Math.round(p.data.amount * 100),
      locationId: p.data.locationId || null,
    },
  });
  revalidatePath("/panel/admin/financiero");
}

export async function deleteExpense(formData: FormData) {
  const session = await staff();
  const id = String(formData.get("id") ?? "");
  await prisma.expense.deleteMany({ where: { id, tenantId: session.tenantId } });
  revalidatePath("/panel/admin/financiero");
}
