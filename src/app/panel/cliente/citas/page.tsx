import Link from "next/link";
import { CalendarPlus, CalendarClock, MapPin, Scissors, User, CheckCircle2, XCircle, RotateCcw, X } from "lucide-react";
import { requireRole, ROLES, APPOINTMENT_STATUS } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { formatCOP } from "@/lib/utils";
import { cancelAppointment } from "./actions";

const STATUS_META: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pendiente", className: "border-amber-500/30 bg-amber-500/10 text-amber-300" },
  CONFIRMED: { label: "Confirmada", className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
  COMPLETED: { label: "Completada", className: "border-morado/30 bg-morado/10 text-morado-light" },
  CANCELLED: { label: "Cancelada", className: "border-red-500/30 bg-red-500/10 text-red-300" },
};

function fmt(d: Date) {
  return new Date(d).toLocaleString("es-CO", { timeZone: "America/Bogota", weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default async function CitasPage({ searchParams }: { searchParams: Promise<{ ok?: string; cancel?: string }> }) {
  const session = await requireRole(ROLES.CLIENT);
  const { ok, cancel } = await searchParams;

  const appts = await prisma.appointment.findMany({
    where: { clientId: session.uid, tenantId: session.tenantId },
    include: { barber: { include: { user: true } }, service: true, location: true },
    orderBy: { startAt: "desc" },
  });

  const now = Date.now();
  const upcoming = appts.filter((a) => a.status !== APPOINTMENT_STATUS.CANCELLED && new Date(a.startAt).getTime() >= now);
  const history = appts.filter((a) => !(a.status !== APPOINTMENT_STATUS.CANCELLED && new Date(a.startAt).getTime() >= now));

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">Mis citas</h1>
          <p className="text-sm text-mist">Tus próximas citas y tu historial.</p>
        </div>
        <Link href="/panel/cliente/agendar" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-morado to-naranja px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5">
          <CalendarPlus className="h-4 w-4" /> Agendar cita
        </Link>
      </div>

      {ok && (
        <p className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <CheckCircle2 className="h-4 w-4" /> ¡Cita confirmada! Te esperamos.
        </p>
      )}
      {cancel && (
        <p className="mt-6 flex items-center gap-2 rounded-xl border border-line bg-surface/40 px-4 py-3 text-sm text-mist">
          <XCircle className="h-4 w-4" /> Tu cita fue cancelada.
        </p>
      )}

      {/* Próximas */}
      <h2 className="mt-8 font-display text-lg font-semibold text-cloud">Próximas</h2>
      {upcoming.length === 0 ? (
        <p className="mt-3 rounded-xl border border-line bg-surface/30 px-4 py-6 text-center text-sm text-mist">
          No tienes citas próximas. <Link href="/panel/cliente/agendar" className="text-morado-light hover:text-cloud">Agenda una</Link>.
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          {upcoming.map((a) => (
            <AppointmentCard key={a.id} a={a} cancelable />
          ))}
        </div>
      )}

      {/* Historial */}
      {history.length > 0 && (
        <>
          <h2 className="mt-10 font-display text-lg font-semibold text-cloud">Historial</h2>
          <div className="mt-3 space-y-3">
            {history.map((a) => (
              <AppointmentCard key={a.id} a={a} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

type ApptWithRels = {
  id: string;
  startAt: Date;
  status: string;
  priceCents: number;
  barber: { user: { firstName: string; lastName: string } };
  service: { name: string };
  location: { name: string };
};

function AppointmentCard({ a, cancelable = false }: { a: ApptWithRels; cancelable?: boolean }) {
  const meta = STATUS_META[a.status] ?? STATUS_META.PENDING;
  return (
    <div className="card-premium flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-morado/15 text-morado-light">
          <CalendarClock className="h-5 w-5" />
        </span>
        <div className="space-y-1 text-sm">
          <p className="font-display text-base font-semibold text-cloud">{a.service.name}</p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-mist">
            <span className="inline-flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {a.barber.user.firstName} {a.barber.user.lastName}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {a.location.name}</span>
          </p>
          <p className="capitalize text-cloud">{fmt(a.startAt)}</p>
          <p className="inline-flex items-center gap-1.5 text-mist"><Scissors className="h-3.5 w-3.5" /> {formatCOP(a.priceCents / 100)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:flex-col sm:items-end">
        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${meta.className}`}>{meta.label}</span>
        {cancelable && (
          <div className="flex gap-2">
            <Link href={`/panel/cliente/agendar?reagendar=${a.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-cloud transition-colors hover:border-morado/50">
              <RotateCcw className="h-3.5 w-3.5" /> Reprogramar
            </Link>
            <form action={cancelAppointment}>
              <input type="hidden" name="id" value={a.id} />
              <button type="submit" className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-300 transition-colors hover:bg-red-500/10">
                <X className="h-3.5 w-3.5" /> Cancelar
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
