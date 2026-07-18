import { requireRole, ROLES, ROLE_LABELS, type Role } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { getAdminData } from "@/lib/admin";
import { AdminDashboard } from "@/components/panel/AdminDashboard";

export default async function AdminPanel() {
  const session = await requireRole(ROLES.ADMIN, ROLES.OWNER);
  const [data, rated] = await Promise.all([
    getAdminData(session.tenantId),
    prisma.barberProfile.findMany({ where: { tenantId: session.tenantId, active: true }, include: { user: true }, orderBy: { rating: "desc" }, take: 5 }),
  ]);
  const topRated = rated.map((b) => ({ label: `${b.user.firstName} ${b.user.lastName}`, rating: b.rating }));

  return <AdminDashboard data={data} tenantName={session.tenantSlug} roleLabel={ROLE_LABELS[session.role as Role] ?? session.role} topRated={topRated} />;
}
