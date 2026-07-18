import { Users, Scissors } from "lucide-react";
import { requireRole, ROLES, APPOINTMENT_STATUS } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { getBarberProfileForSession } from "@/lib/barber";
import { formatCOP } from "@/lib/utils";

export default async function BarberClientesPage() {
  const session = await requireRole(ROLES.BARBER);
  const profile = await getBarberProfileForSession(session);
  if (!profile) return <p className="text-mist">Sin perfil de barbero.</p>;

  const grouped = await prisma.appointment.groupBy({
    by: ["clientId"],
    where: { tenantId: session.tenantId, barberId: profile.id, status: APPOINTMENT_STATUS.COMPLETED },
    _count: { _all: true },
    _sum: { priceCents: true },
    orderBy: { _count: { clientId: "desc" } },
    take: 20,
  });

  const clients = await prisma.user.findMany({
    where: { id: { in: grouped.map((g) => g.clientId) } },
    select: { id: true, firstName: true, lastName: true, phone: true },
  });
  const byId = new Map(clients.map((c) => [c.id, c]));

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-morado to-naranja text-white"><Users className="h-5 w-5" /></span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">Clientes frecuentes</h1>
          <p className="text-sm text-mist">Quiénes vuelven contigo, ordenados por número de visitas.</p>
        </div>
      </div>

      {grouped.length === 0 ? (
        <p className="mt-8 text-center text-mist">Aún no tienes clientes con servicios completados.</p>
      ) : (
        <div className="mt-6 space-y-2">
          {grouped.map((g, i) => {
            const c = byId.get(g.clientId);
            return (
              <div key={g.clientId} className="card-premium flex items-center gap-4 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-morado/15 font-display text-sm font-semibold text-morado-light">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-cloud">{c ? `${c.firstName} ${c.lastName}` : "Cliente"}</p>
                  {c?.phone && <p className="text-xs text-mist">{c.phone}</p>}
                </div>
                <div className="text-right text-sm">
                  <p className="inline-flex items-center gap-1 text-cloud"><Scissors className="h-3.5 w-3.5 text-morado-light" /> {g._count._all} visitas</p>
                  <p className="text-xs text-mist">{formatCOP((g._sum.priceCents ?? 0) / 100)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
