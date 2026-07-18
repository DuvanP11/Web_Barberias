import { requireSession } from "@/lib/rbac";
import { PanelShell } from "@/components/panel/PanelShell";
import { logout } from "./actions";

/**
 * Layout de TODOS los paneles. Guarda de acceso: exige una sesión válida (si no,
 * redirige a /ingresar). Sirve el shell (sidebar + topbar) con la navegación que
 * corresponde al rol. Cada página interior refuerza su propio rol con requireRole.
 */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  return (
    <PanelShell
      role={session.role}
      userName={session.name}
      email={session.email}
      tenantSlug={session.tenantSlug}
      logoutAction={logout}
    >
      {children}
    </PanelShell>
  );
}
