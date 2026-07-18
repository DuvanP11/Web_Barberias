import { redirect } from "next/navigation";
import { requireSession, panelHome } from "@/lib/rbac";

/** Enruta a cada quien a su panel según el rol. */
export default async function PanelIndex() {
  const session = await requireSession();
  redirect(panelHome(session.role));
}
