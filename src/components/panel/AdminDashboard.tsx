import { Scissors, Wallet, TrendingUp, TrendingDown, Percent, Users, CalendarClock, Star, MapPin } from "lucide-react";
import { StatCard } from "./StatCard";
import { BarChart } from "./BarChart";
import { formatCOP } from "@/lib/utils";
import type { getAdminData } from "@/lib/admin";

type Data = Awaited<ReturnType<typeof getAdminData>>;

function TopList({ title, items, kind }: { title: string; items: { key: string; label: string; count: number; sum: number }[]; kind: "count" | "sum" }) {
  return (
    <div className="card-premium p-6">
      <h3 className="font-display text-base font-semibold text-cloud">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-mist">Sin datos.</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {items.map((it, i) => (
            <li key={it.key} className="flex items-center gap-3 text-sm">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-morado/15 text-xs font-semibold text-morado-light">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate text-cloud">{it.label}</span>
              <span className="shrink-0 font-medium text-mist">{kind === "count" ? `${it.count}` : formatCOP(it.sum / 100)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AdminDashboard({
  data,
  tenantName,
  roleLabel,
  topRated,
}: {
  data: Data;
  tenantName: string;
  roleLabel: string;
  topRated: { label: string; rating: number }[];
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-morado-light">Panel de {roleLabel}</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-cloud md:text-3xl">{tenantName}</h1>
      </div>

      {/* KPIs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Scissors} label="Total de cortes" value={data.totalCuts} />
        <StatCard icon={Wallet} label="Ingresos" value={formatCOP(data.incomeCents / 100)} accent="naranja" />
        <StatCard icon={TrendingUp} label="Ganancia neta" value={formatCOP(data.netCents / 100)} accent="naranja" hint="Ingresos − gastos" />
        <StatCard icon={TrendingDown} label="Gastos" value={formatCOP(data.expensesCents / 100)} />
        <StatCard icon={Percent} label="Comisiones pagadas" value={formatCOP(data.commissionsCents / 100)} />
        <StatCard icon={CalendarClock} label="Citas hoy / próximas" value={`${data.todayCount} / ${data.upcomingCount}`} />
        <StatCard icon={Users} label="Clientes" value={data.clientsCount} />
        <StatCard icon={Star} label="Calificación" value={data.avgRating ? data.avgRating.toFixed(1) : "—"} accent="naranja" hint={`${data.reviewsCount} reseñas`} />
      </div>

      {/* Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card-premium p-6">
          <h3 className="font-display text-base font-semibold text-cloud">Cortes por mes</h3>
          <div className="mt-4"><BarChart data={data.cutsByMonth} /></div>
        </div>
        <div className="card-premium p-6">
          <h3 className="font-display text-base font-semibold text-cloud">Ingresos por mes</h3>
          <p className="text-xs text-mist-2">En cientos de miles (COP).</p>
          <div className="mt-4"><BarChart data={data.incomeByMonth} /></div>
        </div>
      </div>

      <div className="mt-6 card-premium p-6">
        <h3 className="font-display text-base font-semibold text-cloud">Horarios con mayor demanda</h3>
        <div className="mt-4"><BarChart data={data.busyHours} height={180} /></div>
      </div>

      {/* Tops */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TopList title="Barberos con más cortes" items={data.topBarbersByCuts} kind="count" />
        <TopList title="Barberos con más ingresos" items={data.topBarbersByIncome} kind="sum" />
        <div className="card-premium p-6">
          <h3 className="font-display text-base font-semibold text-cloud">Barberos mejor calificados</h3>
          <ul className="mt-4 space-y-2.5">
            {topRated.map((b, i) => (
              <li key={b.label} className="flex items-center gap-3 text-sm">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-morado/15 text-xs font-semibold text-morado-light">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate text-cloud">{b.label}</span>
                <span className="inline-flex shrink-0 items-center gap-1 text-naranja-light"><Star className="h-3.5 w-3.5 fill-naranja text-naranja" /> {b.rating.toFixed(1)}</span>
              </li>
            ))}
          </ul>
        </div>
        <TopList title="Servicios más vendidos" items={data.topServices} kind="count" />
        <TopList title="Clientes más frecuentes" items={data.topClients} kind="count" />
      </div>

      {/* Comparativo de sedes — solo si hay más de una */}
      {data.locationsCount > 1 && (
        <div className="mt-8 card-premium p-6">
          <h3 className="flex items-center gap-2 font-display text-base font-semibold text-cloud">
            <MapPin className="h-4 w-4 text-morado-light" /> Comparativo entre sedes
          </h3>
          <div className="mt-4 space-y-3">
            {data.perLocation.map((l) => {
              const maxSum = Math.max(...data.perLocation.map((x) => x.sum), 1);
              return (
                <div key={l.key}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-cloud">{l.label}</span>
                    <span className="text-mist">{l.count} cortes · {formatCOP(l.sum / 100)}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-gradient-to-r from-morado to-naranja" style={{ width: `${(l.sum / maxSum) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
