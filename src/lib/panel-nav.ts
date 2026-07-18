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
  { label: "Agenda diaria", icon: CalendarDays, href: soon("Agenda diaria", "Fase 3"), phase: "Fase 3" },
  { label: "Próximas citas", icon: CalendarClock, href: soon("Próximas citas", "Fase 3"), phase: "Fase 3" },
  { label: "Ingresos", icon: Wallet, href: soon("Ingresos", "Fase 3"), phase: "Fase 3" },
  { label: "Comisiones", icon: Percent, href: soon("Comisiones", "Fase 3"), phase: "Fase 3" },
  { label: "Clientes frecuentes", icon: Users, href: soon("Clientes frecuentes", "Fase 3"), phase: "Fase 3" },
  { label: "Disponibilidad", icon: Clock, href: soon("Disponibilidad", "Fase 3"), phase: "Fase 3" },
  { label: "Estadísticas", icon: BarChart3, href: soon("Estadísticas", "Fase 3"), phase: "Fase 3" },
  { label: "Perfil", icon: User, href: "/panel/perfil" },
];

const ADMIN_MODULES: NavItem[] = [
  { label: "Usuarios", icon: Users, href: soon("Usuarios", "Fase 4"), phase: "Fase 4" },
  { label: "Personal", icon: UserCog, href: soon("Personal", "Fase 4"), phase: "Fase 4" },
  { label: "Sedes", icon: MapPin, href: soon("Sedes", "Fase 4"), phase: "Fase 4" },
  { label: "Servicios", icon: Scissors, href: soon("Servicios", "Fase 4"), phase: "Fase 4" },
  { label: "Citas", icon: CalendarDays, href: soon("Citas", "Fase 4"), phase: "Fase 4" },
  { label: "Clientes", icon: UserRound, href: soon("Clientes", "Fase 4"), phase: "Fase 4" },
  { label: "Financiero", icon: Wallet, href: soon("Financiero", "Fase 4"), phase: "Fase 4" },
  { label: "Comisiones", icon: Percent, href: soon("Comisiones", "Fase 4"), phase: "Fase 4" },
  { label: "Estadísticas", icon: BarChart3, href: soon("Estadísticas", "Fase 4"), phase: "Fase 4" },
  { label: "Multimedia", icon: ImageIcon, href: soon("Multimedia", "Fase 4"), phase: "Fase 4" },
  { label: "Reportes", icon: FileText, href: soon("Reportes", "Fase 4"), phase: "Fase 4" },
  { label: "Configuración", icon: Settings, href: soon("Configuración", "Fase 4"), phase: "Fase 4" },
];

const ADMIN_NAV: NavItem[] = [
  { label: "Inicio", icon: LayoutDashboard, href: "/panel/admin" },
  ...ADMIN_MODULES,
  { label: "Perfil", icon: User, href: "/panel/perfil" },
];

const OWNER_NAV: NavItem[] = [
  { label: "Inicio", icon: LayoutDashboard, href: "/panel/dueno" },
  ...ADMIN_MODULES,
  { label: "Comparativo de sedes", icon: GitCompare, href: soon("Comparativo de sedes", "Fase 4"), phase: "Fase 4" },
  { label: "Administradores", icon: ShieldCheck, href: soon("Administradores", "Fase 4"), phase: "Fase 4" },
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
