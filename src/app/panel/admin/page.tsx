import { requireRole, ROLES } from "@/lib/rbac";
import { PanelHome } from "@/components/panel/PanelHome";

export default async function AdminPanel() {
  // El Dueño (OWNER) también puede entrar a lo del Admin.
  const session = await requireRole(ROLES.ADMIN, ROLES.OWNER);
  return <PanelHome role={session.role} name={session.name} />;
}
