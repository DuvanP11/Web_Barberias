import { requireRole, ROLES } from "@/lib/rbac";
import { PanelHome } from "@/components/panel/PanelHome";

export default async function BarberoPanel() {
  const session = await requireRole(ROLES.BARBER);
  return <PanelHome role={session.role} name={session.name} />;
}
