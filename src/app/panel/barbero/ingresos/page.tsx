import { Wallet, Percent, TrendingUp } from "lucide-react";
import { requireRole, ROLES, APPOINTMENT_STATUS } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { getBarberProfileForSession, getBarberStats } from "@/lib/barber";
import { StatCard } from "@/components/panel/StatCard";
import { BarChart } from "@/components/panel/BarChart";
import { formatCOP } from "@/lib/utils";

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default async function BarberIngresosPage() {
  const session = await requireRole(ROLES.BARBER);
  const profile = await getBarberProfileForSession(session);
  if (!profile) return <p className="text-mist">Sin perfil de barbero.</p>;

  const stats = await getBarberStats(session.tenantId, profile.id, profile.commissionPct);

  const since = new Date();
  since.setMonth(since.getMonth() - 5);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);
  const completed = await prisma.appointment.findMany({
    where: { tenantId: session.tenantId, barberId: profile.id, status: APPOINTMENT_STATUS.COMPLETED, startAt: { gte: since } },
    select: { startAt: true, priceCents: true },
  });

  const byMonth: { label: string; value: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(since);
    d.setMonth(since.getMonth() + i);
    const total = completed
      .filter((a) => new Date(a.startAt).getMonth() === d.getMonth() && new Date(a.startAt).getFullYear() === d.getFullYear())
      .reduce((acc, a) => acc + a.priceCents, 0);
    byMonth.push({ label: MONTHS[d.getMonth()], value: Math.round((total * profile.commissionPct) / 100 / 1000) });
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">Ingresos y comisiones</h1>
      <p className="mt-1 text-sm text-mist">Tu desempeño económico. Comisión actual: {profile.commissionPct}%.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Wallet} label="Ingresos generados" value={formatCOP(stats.incomeCents / 100)} accent="naranja" hint="Total de tus servicios" />
        <StatCard icon={Percent} label="Mis comisiones" value={formatCOP(stats.commissionCents / 100)} accent="naranja" />
        <StatCard icon={TrendingUp} label="Servicios completados" value={stats.completedCount} />
      </div>

      <div className="card-premium mt-8 p-6">
        <h2 className="font-display text-lg font-semibold text-cloud">Comisiones por mes</h2>
        <p className="text-xs text-mist-2">En miles de pesos (COP).</p>
        <div className="mt-4"><BarChart data={byMonth} suffix="k" /></div>
      </div>
    </div>
  );
}
