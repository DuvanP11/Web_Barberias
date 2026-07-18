import { requireRole, ROLES } from "@/lib/rbac";
import { PanelHome } from "@/components/panel/PanelHome";

export default async function ClientePanel() {
  const session = await requireRole(ROLES.CLIENT);
  return <PanelHome role={session.role} name={session.name} />;
}
