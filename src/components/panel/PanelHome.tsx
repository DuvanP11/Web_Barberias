import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { modulesForRole } from "@/lib/panel-nav";
import { ROLE_LABELS, type Role } from "@/lib/roles";

/**
 * Dashboard de inicio de un panel: bienvenida + rejilla de módulos del rol.
 * Cada tarjeta lleva a su módulo (o a "próximamente" si llega en una fase
 * posterior). Es el esqueleto sobre el que se montan los módulos reales.
 */
export function PanelHome({ role, name }: { role: string; name: string | null }) {
  const modules = modulesForRole(role);
  const roleLabel = ROLE_LABELS[role as Role] ?? role;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="card-premium relative overflow-hidden p-6 md:p-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-morado/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.2em] text-morado-light">Panel de {roleLabel}</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-cloud md:text-3xl">
            Hola{name ? `, ${name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="mt-2 max-w-xl text-sm text-mist">
            Este es tu panel. Los módulos se irán habilitando por fases; abajo está el mapa completo
            de lo que podrás gestionar desde aquí.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.label}
              href={m.href}
              className="card-premium group flex items-start gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-morado/50"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-morado/20 to-naranja/20 text-morado-light">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="font-display text-base font-semibold text-cloud">{m.label}</span>
                  {m.phase && (
                    <span className="rounded-full border border-line px-1.5 py-0.5 text-[10px] text-mist-2">
                      {m.phase}
                    </span>
                  )}
                </span>
                <span className="mt-1 flex items-center gap-1 text-xs text-mist">
                  Abrir <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
