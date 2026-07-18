import { CalendarDays, User, Scissors, MapPin, Check, X, Clock } from "lucide-react";
import { requireRole, ROLES, APPOINTMENT_STATUS, APPOINTMENT_STATUS_LABELS } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { getBarberProfileForSession } from "@/lib/barber";
import { formatCOP } from "@/lib/utils";
import { completeAppointment, cancelBarberAppointment } from "./actions";

const STATUS_CLASS: Record<string, string> = {
  PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  CONFIRMED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  COMPLETED: "border-morado/30 bg-morado/10 text-morado-light",
  CANCELLED: "border-red-500/30 bg-red-500/10 text-red-300",
};

export default async function BarberAgendaPage() {
  const session = await requireRole(ROLES.BARBER);
  const profile = await getBarberProfileForSession(session);
  if (!profile) return <p className="text-mist">Sin perfil de barbero.</p>;

  const appts = await prisma.appointment.findMany({
    where: { tenantId: session.tenantId, barberId: profile.id },
    include: { client: true, service: true, location: true },
    orderBy: { startAt: "desc" },
  });

  const now = Date.now();
  const upcoming = appts.filter((a) => a.status !== "CANCELLED" && a.status !== "COMPLETED" && new Date(a.startAt).getTime() >= now).reverse();
  const past = appts.filter((a) => !(a.status !== "CANCELLED" && a.status !== "COMPLETED" && new Date(a.startAt).getTime() >= now));

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-morado to-naranja text-white"><CalendarDays className="h-5 w-5" /></span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">Mi agenda</h1>
          <p className="text-sm text-mist">Tus próximas citas y tu historial.</p>
        </div>
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold text-cloud">Próximas ({upcoming.length})</h2>
      {upcoming.length === 0 ? (
        <p className="mt-3 rounded-xl border border-line bg-surface/30 px-4 py-6 text-center text-sm text-mist">No tienes citas próximas.</p>
      ) : (
        <div className="mt-3 space-y-3">
          {upcoming.map((a) => (
            <div key={a.id} className="card-premium flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="inline-flex flex-col items-center rounded-xl bg-morado/15 px-3 py-2 text-morado-light">
                  <Clock className="h-4 w-4" />
                  <span className="mt-1 text-xs">{new Date(a.startAt).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</span>
                </span>
                <div className="space-y-1 text-sm">
                  <p className="capitalize text-cloud">{new Date(a.startAt).toLocaleDateString("es-CO", { weekday: "long", day: "2-digit", month: "long" })}</p>
                  <p className="flex flex-wrap gap-x-4 gap-y-1 text-mist">
                    <span className="inline-flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {a.client.firstName} {a.client.lastName}</span>
                    <span className="inline-flex items-center gap-1.5"><Scissors className="h-3.5 w-3.5" /> {a.service.name} · {formatCOP(a.priceCents / 100)}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {a.location.name}</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <form action={completeAppointment}>
                  <input type="hidden" name="id" value={a.id} />
                  <button className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 px-3 py-1.5 text-xs text-emerald-300 transition-colors hover:bg-emerald-500/10">
                    <Check className="h-3.5 w-3.5" /> Completar
                  </button>
                </form>
                <form action={cancelBarberAppointment}>
                  <input type="hidden" name="id" value={a.id} />
                  <button className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-300 transition-colors hover:bg-red-500/10">
                    <X className="h-3.5 w-3.5" /> Cancelar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-10 font-display text-lg font-semibold text-cloud">Historial</h2>
      <div className="mt-3 space-y-2">
        {past.slice(0, 30).map((a) => (
          <div key={a.id} className="flex items-center justify-between gap-3 rounded-xl border border-line/60 bg-surface/30 px-4 py-3 text-sm">
            <div className="min-w-0">
              <p className="truncate text-cloud">{a.client.firstName} {a.client.lastName} · {a.service.name}</p>
              <p className="text-xs text-mist">{new Date(a.startAt).toLocaleDateString("es-CO")} · {formatCOP(a.priceCents / 100)}</p>
            </div>
            <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs ${STATUS_CLASS[a.status]}`}>{APPOINTMENT_STATUS_LABELS[a.status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
