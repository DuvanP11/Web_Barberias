import {
  LayoutDashboard,
  CalendarDays,
  CalendarPlus,
  CalendarClock,
  Gift,
  Share2,
  ClipboardList,
  User,
  Wallet,
  Percent,
  Users,
  UserRound,
  UserCog,
  Clock,
  BarChart3,
  MapPin,
  Scissors,
  Image as ImageIcon,
  FileText,
  Settings,
  GitCompare,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { ROLES, type Role } from "./roles";

/**
 * Navegación de cada panel. Los ítems ya construidos apuntan a su ruta real;
 * los que llegan en fases siguientes apuntan a la página "próximamente" (con su
 * nombre), así el menú refleja TODO el alcance sin dejar enlaces muertos.
 */
export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  phase?: string; // etiqueta de fase para los módulos pendientes
}

function soon(label: string, phase: string): string {
  return `/panel/proximamente?m=${encodeURIComponent(label)}&f=${encodeURIComponent(phase)}`;
}

const CLIENT_NAV: NavItem[] = [
  { label: "Inicio", icon: LayoutDashboard, href: "/panel/cliente" },
  { label: "Agendar", icon: CalendarPlus, href: "/panel/cliente/agendar" },
  { label: "Mis citas", icon: CalendarDays, href: "/panel/cliente/citas" },
  { label: "Fidelización", icon: Gift, href: "/panel/cliente/fidelizacion" },
  { label: "Referidos", icon: Share2, href: "/panel/cliente/referidos" },
  { label: "Asesoría", icon: ClipboardList, href: "/panel/cliente/asesoria" },
  { label: "Perfil", icon: User, href: "/panel/perfil" },
];

const BARBER_NAV: NavItem[] = [
  { label: "Inicio", icon: LayoutDashboard, href: "/panel/barbero" },
  { label: "Agenda", icon: CalendarDays, href: "/panel/barbero/agenda" },
  { label: "Ingresos y comisiones", icon: Wallet, href: "/panel/barbero/ingresos" },
  { label: "Clientes frecuentes", icon: Users, href: "/panel/barbero/clientes" },
  { label: "Perfil", icon: User, href: "/panel/perfil" },
];

const ADMIN_MODULES: NavItem[] = [
  { label: "Citas", icon: CalendarDays, href: "/panel/admin/citas" },
  { label: "Servicios", icon: Scissors, href: "/panel/admin/servicios" },
  { label: "Sedes", icon: MapPin, href: "/panel/admin/sedes" },
  { label: "Personal", icon: UserCog, href: "/panel/admin/usuarios" },
  { label: "Clientes", icon: UserRound, href: "/panel/admin/clientes" },
  { label: "Comisiones", icon: Percent, href: "/panel/admin/comisiones" },
  { label: "Financiero", icon: Wallet, href: "/panel/admin/financiero" },
  { label: "Reportes", icon: FileText, href: "/panel/admin/reportes" },
  { label: "Multimedia", icon: ImageIcon, href: soon("Multimedia", "Fase 5"), phase: "Fase 5" },
  { label: "Configuración", icon: Settings, href: "/panel/admin/configuracion" },
];

const ADMIN_NAV: NavItem[] = [
  { label: "Inicio", icon: LayoutDashboard, href: "/panel/admin" },
  ...ADMIN_MODULES,
  { label: "Perfil", icon: User, href: "/panel/perfil" },
];

const OWNER_NAV: NavItem[] = [
  { label: "Inicio", icon: LayoutDashboard, href: "/panel/dueno" },
  ...ADMIN_MODULES,
  { label: "Perfil", icon: User, href: "/panel/perfil" },
];

export function navForRole(role: string): NavItem[] {
  switch (role) {
    case ROLES.OWNER:
      return OWNER_NAV;
    case ROLES.ADMIN:
      return ADMIN_NAV;
    case ROLES.BARBER:
      return BARBER_NAV;
    default:
      return CLIENT_NAV;
  }
}

/** Módulos que se muestran como tarjetas en el dashboard de cada rol (sin "Inicio"/"Perfil"). */
export function modulesForRole(role: string): NavItem[] {
  return navForRole(role).filter((i) => i.label !== "Inicio" && i.label !== "Perfil");
}

export type { Role };
