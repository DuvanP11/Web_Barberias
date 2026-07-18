import type { LucideIcon } from "lucide-react";

/** Tarjeta de indicador (KPI) para los dashboards. */
export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = "morado",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  accent?: "morado" | "naranja";
}) {
  return (
    <div className="card-premium p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-mist-2">{label}</p>
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl ${
            accent === "naranja" ? "bg-naranja/15 text-naranja-light" : "bg-morado/15 text-morado-light"
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-semibold text-cloud md:text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-mist">{hint}</p>}
    </div>
  );
}
