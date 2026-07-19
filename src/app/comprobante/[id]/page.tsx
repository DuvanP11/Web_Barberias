import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Scissors } from "lucide-react";
import { requireRole, ROLES, PAYMENT_METHOD_LABELS } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { formatCOP } from "@/lib/utils";
import { PrintButton } from "@/components/ui/PrintButton";

export default async function ComprobantePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole(ROLES.ADMIN, ROLES.OWNER);
  const { id } = await params;

  const payment = await prisma.payment.findFirst({
    where: { id, tenantId: session.tenantId },
    include: { appointment: { include: { client: true, service: true, location: true, barber: { include: { user: true } } } }, tenant: true },
  });
  if (!payment) notFound();

  const a = payment.appointment;

  return (
    <div className="container-app min-h-screen py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-4 flex items-center justify-between print:hidden">
          <Link href="/panel/admin/citas" className="inline-flex items-center gap-2 text-sm text-mist hover:text-cloud">
            <ArrowLeft className="h-4 w-4" /> Volver
          </Link>
          <PrintButton />
        </div>

        <div className="card-premium p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-morado to-naranja text-white"><Scissors className="h-5 w-5" /></span>
              <span className="font-display text-lg font-bold text-cloud">{payment.tenant.name}</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" /> Pagado
            </span>
          </div>

          <div className="mt-6 border-t border-line pt-6">
            <p className="text-xs uppercase tracking-wider text-mist-2">Comprobante</p>
            <p className="font-display text-xl font-semibold text-cloud">{payment.reference}</p>
            <p className="mt-1 text-sm text-mist">{new Date(payment.createdAt).toLocaleString("es-CO", { timeZone: "America/Bogota" })}</p>
          </div>

          <dl className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
            {[
              ["Cliente", a ? `${a.client.firstName} ${a.client.lastName}` : "—"],
              ["Servicio", a?.service.name ?? "—"],
              ["Barbero", a ? `${a.barber.user.firstName} ${a.barber.user.lastName}` : "—"],
              ["Sede", a?.location.name ?? "—"],
              ["Método de pago", PAYMENT_METHOD_LABELS[payment.method] ?? payment.method],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-mist">{k}</dt>
                <dd className="text-right font-medium text-cloud">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex items-center justify-between border-t border-line pt-6">
            <span className="font-display text-lg font-semibold text-cloud">Total</span>
            <span className="font-display text-2xl font-semibold text-gradient-brand">{formatCOP(payment.amountCents / 100)}</span>
          </div>

          <p className="mt-6 text-center text-xs text-mist-2">Gracias por tu preferencia · {payment.tenant.name}</p>
        </div>
      </div>
    </div>
  );
}
