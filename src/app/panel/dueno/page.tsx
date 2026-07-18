import { requireRole, ROLES } from "@/lib/rbac";
import { PanelHome } from "@/components/panel/PanelHome";

export default async function DuenoPanel() {
  const session = await requireRole(ROLES.OWNER);
  return <PanelHome role={session.role} name={session.name} />;
}
