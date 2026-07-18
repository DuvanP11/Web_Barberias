"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogOut, Scissors } from "lucide-react";
import { navForRole } from "@/lib/panel-nav";
import { ROLE_LABELS, type Role } from "@/lib/roles";
import { cn } from "@/lib/utils";

interface PanelShellProps {
  role: string;
  userName: string | null;
  email: string;
  tenantSlug: string;
  logoutAction: () => void;
  children: React.ReactNode;
}

/**
 * Shell de los paneles: sidebar de navegación (según rol) + topbar con el
 * usuario y cerrar sesión. Responsive: en móvil el sidebar es un cajón.
 */
export function PanelShell({ role, userName, email, tenantSlug, logoutAction, children }: PanelShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const nav = navForRole(role);
  const roleLabel = ROLE_LABELS[role as Role] ?? role;

  const initials = (userName ?? email)
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    return pathname === base;
  };

  return (
    <div className="min-h-screen bg-ink">
      {/* Sidebar (escritorio) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-ink-soft/70 lg:flex">
        <SidebarContent nav={nav} isActive={isActive} />
      </aside>

      {/* Cajón (móvil) */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-line bg-ink-soft">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg text-mist hover:text-cloud"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent nav={nav} isActive={isActive} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Columna de contenido */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-ink/80 px-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
              className="grid h-10 w-10 place-items-center rounded-xl border border-line text-cloud lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-wider text-mist-2">Panel · {roleLabel}</p>
              <p className="font-display text-sm font-semibold text-cloud">{tenantSlug}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-cloud">{userName ?? "Usuario"}</p>
              <p className="text-xs text-mist">{email}</p>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-morado to-naranja text-sm font-bold text-white">
              {initials || "?"}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
                className="grid h-10 w-10 place-items-center rounded-xl border border-line text-mist transition-colors hover:border-morado/50 hover:text-cloud"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </header>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  nav,
  isActive,
  onNavigate,
}: {
  nav: ReturnType<typeof navForRole>;
  isActive: (href: string) => boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      <Link
        href="/"
        className="flex h-16 items-center gap-2.5 border-b border-line px-5 text-cloud"
        onClick={onNavigate}
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-morado to-naranja text-white">
          <Scissors className="h-5 w-5" />
        </span>
        <span className="font-display text-base font-bold">Panel</span>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-morado/15 text-cloud"
                  : "text-mist hover:bg-white/[0.04] hover:text-cloud",
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className={cn("h-4 w-4 shrink-0", active && "text-morado-light")} />
                {item.label}
              </span>
              {item.phase && (
                <span className="rounded-full border border-line px-1.5 py-0.5 text-[10px] text-mist-2">
                  {item.phase}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
