import Link from "next/link";
import { Gift, Scissors, UserPlus, ShoppingBag, Star, CheckCircle2 } from "lucide-react";
import { requireRole, ROLES, APPOINTMENT_STATUS } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

const EARN = [
  { icon: Scissors, label: "Por cada cita agendada", value: "+10 pts" },
  { icon: CheckCircle2, label: "Por cada servicio completado", value: "+20 pts" },
  { icon: UserPlus, label: "Por cada amigo referido que agende", value: "+50 pts" },
];

const REWARDS = [
  { icon: ShoppingBag, label: "Descuento de $10.000", cost: 200 },
  { icon: Scissors, label: "Barba gratis", cost: 400 },
  { icon: Star, label: "Corte + barba gratis", cost: 800 },
];

export default async function FidelizacionPage() {
  const session = await requireRole(ROLES.CLIENT);
  const [user, completed] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.uid }, select: { points: true } }),
    prisma.appointment.count({ where: { clientId: session.uid, status: APPOINTMENT_STATUS.COMPLETED } }),
  ]);
  const points = user?.points ?? 0;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">Fidelización</h1>
      <p className="mt-1 text-sm text-mist">Acumula puntos y canjéalos por beneficios.</p>

      {/* Saldo */}
      <div className="card-premium relative mt-6 overflow-hidden p-8 text-center">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-morado/20 blur-3xl" />
        <div className="relative">
          <Gift className="mx-auto h-8 w-8 text-morado-light" />
          <p className="mt-3 font-display text-5xl font-semibold text-gradient-brand">{points}</p>
          <p className="mt-1 text-sm text-mist">puntos disponibles · {completed} servicios completados</p>
        </div>
      </div>

      {/* Cómo ganar */}
      <h2 className="mt-10 font-display text-lg font-semibold text-cloud">Cómo ganar puntos</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {EARN.map((e) => (
          <div key={e.label} className="card-premium p-5">
            <e.icon className="h-5 w-5 text-morado-light" />
            <p className="mt-3 font-display text-lg font-semibold text-cloud">{e.value}</p>
            <p className="mt-1 text-sm text-mist">{e.label}</p>
          </div>
        ))}
      </div>

      {/* Canjes */}
      <h2 className="mt-10 font-display text-lg font-semibold text-cloud">Canjea tus puntos</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {REWARDS.map((r) => {
          const enough = points >= r.cost;
          return (
            <div key={r.label} className="card-premium flex flex-col p-5">
              <r.icon className="h-5 w-5 text-naranja-light" />
              <p className="mt-3 font-medium text-cloud">{r.label}</p>
              <p className="mt-1 text-sm text-mist">{r.cost} pts</p>
              <button
                type="button"
                disabled={!enough}
                title={enough ? "Disponible en tu próxima visita" : "Te faltan puntos"}
                className="mt-4 rounded-full border border-line px-4 py-2 text-sm text-cloud transition-colors enabled:hover:border-morado/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {enough ? "Canjear" : "Puntos insuficientes"}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-mist-2">
        Ganas 10 puntos con cada cita.{" "}
        <Link href="/panel/cliente/agendar" className="text-morado-light hover:text-cloud">Agenda ahora</Link> y suma.
      </p>
    </div>
  );
}
