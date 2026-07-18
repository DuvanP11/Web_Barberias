"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PortfolioItem {
  id: number;
  image: string;
  barber: string;
  type: string;
  trend: string;
}

const ALL = "Todos";

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-mist-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {[ALL, ...options].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              value === opt
                ? "border-morado/60 bg-morado/10 text-cloud"
                : "border-line bg-white/[0.02] text-mist hover:text-cloud",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PortfolioGallery({
  items,
  barbers,
  types,
  trends,
}: {
  items: PortfolioItem[];
  barbers: string[];
  types: string[];
  trends: string[];
}) {
  const [barber, setBarber] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [trend, setTrend] = useState(ALL);

  const filtered = useMemo(
    () =>
      items.filter(
        (it) =>
          (barber === ALL || it.barber === barber) &&
          (type === ALL || it.type === type) &&
          (trend === ALL || it.trend === trend),
      ),
    [items, barber, type, trend],
  );

  return (
    <div>
      <div className="card-premium space-y-5 p-6">
        <div className="flex items-center gap-2 text-cloud">
          <SlidersHorizontal className="h-4 w-4 text-morado-light" />
          <span className="text-sm font-medium">Filtrar trabajos</span>
        </div>
        <FilterRow label="Barbero" options={barbers} value={barber} onChange={setBarber} />
        <FilterRow label="Tipo de corte" options={types} value={type} onChange={setType} />
        <FilterRow label="Tendencia" options={trends} value={trend} onChange={setTrend} />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-mist">No hay trabajos con esos filtros.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it) => (
            <figure key={it.id} className="card-premium group relative aspect-[3/4] overflow-hidden">
              <Image
                src={it.image}
                alt={`${it.type} por ${it.barber}`}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4">
                <p className="text-sm font-medium text-cloud">{it.type}</p>
                <p className="text-xs text-mist">{it.barber} · {it.trend}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
