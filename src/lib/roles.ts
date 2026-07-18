/**
 * Constantes y tipos de roles/estados — CLIENT-SAFE (sin dependencias de
 * servidor). Se pueden importar tanto desde componentes de cliente como de
 * servidor. Las guardas de sesión viven en `rbac.ts` (solo servidor).
 */

export const ROLES = {
  CLIENT: "CLIENT",
  BARBER: "BARBER",
  ADMIN: "ADMIN",
  OWNER: "OWNER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  CLIENT: "Cliente",
  BARBER: "Barbero",
  ADMIN: "Administrador",
  OWNER: "Dueño",
};

export const APPOINTMENT_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type AppointmentStatus =
  (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];

export function isRole(value: string): value is Role {
  return (
    value === ROLES.CLIENT ||
    value === ROLES.BARBER ||
    value === ROLES.ADMIN ||
    value === ROLES.OWNER
  );
}

/** Ruta de inicio del panel según el rol. */
export function panelHome(role: string): string {
  switch (role) {
    case ROLES.OWNER:
      return "/panel/dueno";
    case ROLES.ADMIN:
      return "/panel/admin";
    case ROLES.BARBER:
      return "/panel/barbero";
    default:
      return "/panel/cliente";
  }
}

/** Jerarquía: el Dueño puede entrar a todo lo del Admin, etc. */
const RANK: Record<Role, number> = { CLIENT: 0, BARBER: 1, ADMIN: 2, OWNER: 3 };

export function roleAtLeast(role: string, min: Role): boolean {
  return isRole(role) && RANK[role] >= RANK[min];
}
