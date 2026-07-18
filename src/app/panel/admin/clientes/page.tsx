import { UserRound, Cake } from "lucide-react";
import { requireRole, ROLES, APPOINTMENT_STATUS } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { formatCOP } from "@/lib/utils";

export default async function ClientesAdminPage() {
  const session = await requireRole(ROLES.ADMIN, ROLES.OWNER);
  const [clients, grouped] = await Promise.all([
    prisma.user.findMany({ where: { tenantId: session.tenantId, role: "CLIENT" }, orderBy: { createdAt: "desc" } }),
    prisma.appointment.groupBy({
      by: ["clientId"],
      where: { tenantId: session.tenantId, status: APPOINTMENT_STATUS.COMPLETED },
      _count: { _all: true },
      _sum: { priceCents: true },
      _max: { startAt: true },
    }),
  ]);
  const byId = new Map(grouped.map((g) => [g.clientId, g]));

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-morado to-naranja text-white"><UserRound className="h-5 w-5" /></span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">Clientes</h1>
          <p className="text-sm text-mist">{clients.length} clientes registrados.</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-mist-2">
              <th className="px-3 py-2">Cliente</th>
              <th className="px-3 py-2">Contacto</th>
              <th className="px-3 py-2">Visitas</th>
              <th className="px-3 py-2">Total gastado</th>
              <th className="px-3 py-2">Última visita</th>
              <th className="px-3 py-2">Puntos</th>
              <th className="px-3 py-2">Cumpleaños</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => {
              const g = byId.get(c.id);
              return (
                <tr key={c.id} className="border-b border-line/50">
                  <td className="px-3 py-2.5 font-medium text-cloud">{c.firstName} {c.lastName}</td>
                  <td className="px-3 py-2.5 text-mist">{c.phone ?? c.email}</td>
                  <td className="px-3 py-2.5 text-cloud">{g?._count._all ?? 0}</td>
                  <td className="px-3 py-2.5 text-cloud">{formatCOP((g?._sum.priceCents ?? 0) / 100)}</td>
                  <td className="px-3 py-2.5 text-mist">{g?._max.startAt ? new Date(g._max.startAt).toLocaleDateString("es-CO") : "—"}</td>
                  <td className="px-3 py-2.5 text-morado-light">{c.points}</td>
                  <td className="px-3 py-2.5 text-mist">
                    {c.birthDate ? (
                      <span className="inline-flex items-center gap-1"><Cake className="h-3.5 w-3.5" /> {new Date(c.birthDate).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}</span>
                    ) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
