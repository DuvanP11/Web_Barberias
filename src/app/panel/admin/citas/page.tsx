import Link from "next/link";
import { CalendarDays, User, MapPin, Receipt, CheckCircle2 } from "lucide-react";
import { requireRole, ROLES, APPOINTMENT_STATUS, APPOINTMENT_STATUS_LABELS, PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { formatCOP } from "@/lib/utils";
import { adminChangeStatus, adminReassignBarber, registerPayment } from "./actions";

const ctrl = "rounded-lg border border-line bg-surface/50 px-2 py-1.5 text-xs text-cloud";

export default async function CitasAdminPage() {
  const session = await requireRole(ROLES.ADMIN, ROLES.OWNER);
  const [appts, barbers] = await Promise.all([
    prisma.appointment.findMany({
      where: { tenantId: session.tenantId },
      include: { client: true, service: true, location: true, barber: { include: { user: true } }, payment: true },
      orderBy: { startAt: "desc" },
      take: 60,
    }),
    prisma.barberProfile.findMany({ where: { tenantId: session.tenantId, active: true }, include: { user: true } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-morado to-naranja text-white"><CalendarDays className="h-5 w-5" /></span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">Citas</h1>
          <p className="text-sm text-mist">Últimas 60 citas. Cambia el estado o reasigna el barbero.</p>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {appts.map((a) => (
          <div key={a.id} className="card-premium flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 text-sm">
              <p className="font-medium text-cloud">
                {new Date(a.startAt).toLocaleString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })} · {a.service.name} · {formatCOP(a.priceCents / 100)}
              </p>
              <p className="flex flex-wrap gap-x-4 gap-y-1 text-mist">
                <span className="inline-flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {a.client.firstName} {a.client.lastName}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {a.location.name}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <form action={adminReassignBarber} className="flex items-center gap-1">
                <input type="hidden" name="id" value={a.id} />
                <select name="barberId" defaultValue={a.barberId} className={ctrl}>
                  {barbers.map((b) => <option key={b.id} value={b.id}>{b.user.firstName} {b.user.lastName}</option>)}
                </select>
                <button className="rounded-lg border border-line px-2 py-1.5 text-xs text-cloud hover:border-morado/50">Reasignar</button>
              </form>
              <form action={adminChangeStatus} className="flex items-center gap-1">
                <input type="hidden" name="id" value={a.id} />
                <select name="status" defaultValue={a.status} className={ctrl}>
                  {Object.values(APPOINTMENT_STATUS).map((s) => <option key={s} value={s}>{APPOINTMENT_STATUS_LABELS[s]}</option>)}
                </select>
                <button className="rounded-lg border border-line px-2 py-1.5 text-xs text-cloud hover:border-morado/50">Aplicar</button>
              </form>

              {a.payment ? (
                <Link href={`/comprobante/${a.payment.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 px-2.5 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/10">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Pagado · {PAYMENT_METHOD_LABELS[a.payment.method]}
                </Link>
              ) : a.status !== "CANCELLED" ? (
                <form action={registerPayment} className="flex items-center gap-1">
                  <input type="hidden" name="id" value={a.id} />
                  <select name="method" defaultValue="CASH" className={ctrl}>
                    {Object.values(PAYMENT_METHODS).map((m) => <option key={m} value={m}>{PAYMENT_METHOD_LABELS[m]}</option>)}
                  </select>
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2 py-1.5 text-xs text-cloud hover:border-morado/50">
                    <Receipt className="h-3.5 w-3.5" /> Cobrar
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
