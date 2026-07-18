import { Percent, Save } from "lucide-react";
import { requireRole, ROLES, APPOINTMENT_STATUS } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { formatCOP } from "@/lib/utils";
import { updateCommission } from "./actions";

export default async function ComisionesPage() {
  const session = await requireRole(ROLES.ADMIN, ROLES.OWNER);
  const [barbers, grouped] = await Promise.all([
    prisma.barberProfile.findMany({ where: { tenantId: session.tenantId }, include: { user: true }, orderBy: { createdAt: "asc" } }),
    prisma.appointment.groupBy({ by: ["barberId"], where: { tenantId: session.tenantId, status: APPOINTMENT_STATUS.COMPLETED }, _sum: { priceCents: true }, _count: { _all: true } }),
  ]);
  const byBarber = new Map(grouped.map((g) => [g.barberId, g]));

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-morado to-naranja text-white"><Percent className="h-5 w-5" /></span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">Comisiones</h1>
          <p className="text-sm text-mist">Configura el porcentaje de cada barbero y revisa lo generado.</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {barbers.map((b) => {
          const g = byBarber.get(b.id);
          const income = g?._sum.priceCents ?? 0;
          const commission = Math.round((income * b.commissionPct) / 100);
          return (
            <div key={b.id} className="card-premium flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-cloud">{b.user.firstName} {b.user.lastName}</p>
                <p className="text-sm text-mist">{g?._count._all ?? 0} servicios · genera {formatCOP(income / 100)}</p>
                <p className="text-sm text-naranja-light">Comisión acumulada: {formatCOP(commission / 100)}</p>
              </div>
              <form action={updateCommission} className="flex items-center gap-2">
                <input type="hidden" name="id" value={b.id} />
                <label className="flex items-center gap-1 text-sm text-cloud">
                  <input name="pct" type="number" min="0" max="100" defaultValue={b.commissionPct} className="w-20 rounded-lg border border-line bg-surface/50 px-3 py-2 text-sm text-cloud" /> %
                </label>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm text-cloud hover:border-morado/50"><Save className="h-4 w-4" /> Guardar</button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
