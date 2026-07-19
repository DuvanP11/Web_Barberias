import Link from "next/link";
import { CalendarDays, CalendarClock, Wallet, Percent, Users, Star, ArrowRight, Clock } from "lucide-react";
import { requireRole, ROLES } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { getBarberProfileForSession, getBarberStats, getCutsByDay } from "@/lib/barber";
import { StatCard } from "@/components/panel/StatCard";
import { BarChart } from "@/components/panel/BarChart";
import { formatCOP } from "@/lib/utils";

export default async function BarberoPanel() {
  const session = await requireRole(ROLES.BARBER);
  const profile = await getBarberProfileForSession(session);

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <h1 className="font-display text-2xl font-semibold text-cloud">Perfil de barbero pendiente</h1>
        <p className="mt-2 text-sm text-mist">Tu cuenta es de barbero pero aún no tiene perfil asignado. Pídele al administrador que lo cree.</p>
      </div>
    );
  }

  const [stats, cuts, today] = await Promise.all([
    getBarberStats(session.tenantId, profile.id, profile.commissionPct),
    getCutsByDay(session.tenantId, profile.id, 7),
    prisma.appointment.findMany({
      where: {
        tenantId: session.tenantId,
        barberId: profile.id,
        status: { in: ["PENDING", "CONFIRMED"] },
        startAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)), lt: new Date(new Date().setHours(24, 0, 0, 0)) },
      },
      include: { client: true, service: true },
      orderBy: { startAt: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">Hola, {profile.user.firstName}</h1>
          <p className="text-sm text-mist">{profile.specialty} · comisión {profile.commissionPct}%</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-naranja-light">
          <Star className="h-4 w-4 fill-naranja text-naranja" /> {profile.rating.toFixed(1)}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={CalendarClock} label="Citas hoy" value={stats.todayCount} />
        <StatCard icon={CalendarDays} label="Próximas" value={stats.upcomingCount} />
        <StatCard icon={Users} label="Clientes atendidos" value={stats.clientsServed} />
        <StatCard icon={Wallet} label="Ingresos generados" value={formatCOP(stats.incomeCents / 100)} accent="naranja" />
        <StatCard icon={Percent} label="Mis comisiones" value={formatCOP(stats.commissionCents / 100)} accent="naranja" hint={`${profile.commissionPct}% de tus servicios`} />
        <StatCard icon={CalendarDays} label="Cortes completados" value={stats.completedCount} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="card-premium p-6">
          <h2 className="font-display text-lg font-semibold text-cloud">Cortes de los últimos 7 días</h2>
          <div className="mt-4"><BarChart data={cuts} /></div>
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-cloud">Agenda de hoy</h2>
            <Link href="/panel/barbero/agenda" className="inline-flex items-center gap-1 text-sm text-morado-light hover:text-cloud">
              Ver todo <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {today.length === 0 ? (
            <p className="mt-6 text-center text-sm text-mist">No tienes citas para hoy.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {today.map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-xl border border-line/60 bg-surface/30 p-3">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-morado/15 px-2 py-1 text-xs text-morado-light">
                    <Clock className="h-3 w-3" /> {new Date(a.startAt).toLocaleTimeString("es-CO", { timeZone: "America/Bogota", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-cloud">{a.client.firstName} {a.client.lastName}</p>
                    <p className="truncate text-xs text-mist">{a.service.name}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
