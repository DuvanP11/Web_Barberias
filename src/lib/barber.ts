import "server-only";
import { prisma } from "./prisma";
import { APPOINTMENT_STATUS } from "./roles";
import type { Session } from "./auth";

/** Perfil de barbero del usuario en sesión (o null si no es barbero con perfil). */
export async function getBarberProfileForSession(session: Session) {
  return prisma.barberProfile.findFirst({
    where: { userId: session.uid, tenantId: session.tenantId },
    include: { user: true },
  });
}

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/** Indicadores del barbero. */
export async function getBarberStats(tenantId: string, barberId: string, commissionPct: number) {
  const today = startOfToday();
  const tomorrow = new Date(today.getTime() + 86400000);

  const [todayCount, upcomingCount, completed, distinctClients] = await Promise.all([
    prisma.appointment.count({
      where: { tenantId, barberId, status: { in: [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.CONFIRMED] }, startAt: { gte: today, lt: tomorrow } },
    }),
    prisma.appointment.count({
      where: { tenantId, barberId, status: { in: [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.CONFIRMED] }, startAt: { gte: new Date() } },
    }),
    prisma.appointment.findMany({
      where: { tenantId, barberId, status: APPOINTMENT_STATUS.COMPLETED },
      select: { priceCents: true },
    }),
    prisma.appointment.findMany({
      where: { tenantId, barberId, status: APPOINTMENT_STATUS.COMPLETED },
      select: { clientId: true },
      distinct: ["clientId"],
    }),
  ]);

  const income = completed.reduce((a, c) => a + c.priceCents, 0);
  return {
    todayCount,
    upcomingCount,
    completedCount: completed.length,
    incomeCents: income,
    commissionCents: Math.round((income * commissionPct) / 100),
    clientsServed: distinctClients.length,
  };
}

/** Cortes completados por día en los últimos `days` días. */
export async function getCutsByDay(tenantId: string, barberId: string, days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const appts = await prisma.appointment.findMany({
    where: { tenantId, barberId, status: APPOINTMENT_STATUS.COMPLETED, startAt: { gte: since } },
    select: { startAt: true },
  });

  const buckets: { label: string; value: number }[] = [];
  const DOW = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const count = appts.filter((a) => {
      const s = new Date(a.startAt);
      return s.getDate() === d.getDate() && s.getMonth() === d.getMonth();
    }).length;
    buckets.push({ label: DOW[d.getDay()], value: count });
  }
  return buckets;
}
