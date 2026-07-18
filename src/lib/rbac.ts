import { redirect } from "next/navigation";
import { getSession, type Session } from "./auth";
import { panelHome, type Role } from "./roles";

/**
 * Guardas de acceso basadas en roles (RBAC) — SOLO SERVIDOR (usa cookies).
 * Las constantes y tipos client-safe viven en `roles.ts` y se re-exportan aquí
 * para comodidad de los archivos de servidor.
 */
export * from "./roles";

/** Exige una sesión válida; si no, redirige al login. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/ingresar");
  return session;
}

/**
 * Exige que la sesión tenga uno de los roles permitidos. Si hay sesión pero el
 * rol no aplica, se envía al panel que le corresponda (evita bucles de redirect).
 */
export async function requireRole(...allowed: Role[]): Promise<Session> {
  const session = await requireSession();
  if (!allowed.includes(session.role as Role)) {
    redirect(panelHome(session.role));
  }
  return session;
}
