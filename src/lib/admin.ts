import "server-only";
import { prisma } from "./prisma";
import { APPOINTMENT_STATUS } from "./roles";

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

/**
 * Datos agregados para el dashboard del administrador/dueño. Se calcula desde
 * las citas completadas (con su barbero/servicio/cliente/sede) para no lanzar
 * decenas de consultas. Escala bien para el volumen de una barbería.
 */
export async function getAdminData(tenantId: string) {
  const now = new Date();
  const startToday = new Date(now); startToday.setHours(0, 0, 0, 0);
  const endToday = new Date(startToday.getTime() + 86400000);

  const [completed, expenses, upcomingCount, todayCount, clientsCount, locationsCount, reviewsAgg] = await Promise.all([
    prisma.appointment.findMany({
      where: { tenantId, status: APPOINTMENT_STATUS.COMPLETED },
      include: {
        barber: { include: { user: { select: { firstName: true, lastName: true } } } },
        service: { select: { name: true } },
        client: { select: { firstName: true, lastName: true } },
        location: { select: { name: true } },
      },
    }),
    prisma.expense.aggregate({ where: { tenantId }, _sum: { amountCents: true } }),
    prisma.appointment.count({ where: { tenantId, status: { in: [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.CONFIRMED] }, startAt: { gte: now } } }),
    prisma.appointment.count({ where: { tenantId, status: { in: [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.CONFIRMED] }, startAt: { gte: startToday, lt: endToday } } }),
    prisma.user.count({ where: { tenantId, role: "CLIENT" } }),
    prisma.location.count({ where: { tenantId, active: true } }),
    prisma.review.aggregate({ where: { tenantId, approved: true }, _avg: { rating: true }, _count: true }),
  ]);

  const incomeCents = completed.reduce((a, c) => a + c.priceCents, 0);
  const commissionsCents = completed.reduce((a, c) => a + Math.round((c.priceCents * c.barber.commissionPct) / 100), 0);
  const expensesCents = expenses._sum.amountCents ?? 0;

  // Agrupadores en memoria
  const agg = <T,>(map: Map<string, { key: string; label: string; count: number; sum: number } & T>) =>
    [...map.values()];

  const barbers = new Map<string, { key: string; label: string; count: number; sum: number }>();
  const services = new Map<string, { key: string; label: string; count: number; sum: number }>();
  const clients = new Map<string, { key: string; label: string; count: number; sum: number }>();
  const locations = new Map<string, { key: string; label: string; count: number; sum: number }>();
  const hours = new Map<number, number>();

  for (const a of completed) {
    const bk = a.barberId, sk = a.serviceId, ck = a.clientId, lk = a.locationId;
    if (!barbers.has(bk)) barbers.set(bk, { key: bk, label: `${a.barber.user.firstName} ${a.barber.user.lastName}`, count: 0, sum: 0 });
    if (!services.has(sk)) services.set(sk, { key: sk, label: a.service.name, count: 0, sum: 0 });
    if (!clients.has(ck)) clients.set(ck, { key: ck, label: `${a.client.firstName} ${a.client.lastName}`, count: 0, sum: 0 });
    if (!locations.has(lk)) locations.set(lk, { key: lk, label: a.location.name, count: 0, sum: 0 });
    for (const m of [barbers.get(bk)!, services.get(sk)!, clients.get(ck)!, locations.get(lk)!]) { m.count++; m.sum += a.priceCents; }
    const h = new Date(a.startAt).getHours();
    hours.set(h, (hours.get(h) ?? 0) + 1);
  }

  const byCount = (a: { count: number }, b: { count: number }) => b.count - a.count;
  const bySum = (a: { sum: number }, b: { sum: number }) => b.sum - a.sum;

  // Series últimos 6 meses
  const cutsByMonth: { label: string; value: number }[] = [];
  const incomeByMonth: { label: string; value: number }[] = [];
  const base = new Date(); base.setDate(1); base.setHours(0, 0, 0, 0); base.setMonth(base.getMonth() - 5);
  for (let i = 0; i < 6; i++) {
    const d = new Date(base); d.setMonth(base.getMonth() + i);
    const inMonth = completed.filter((a) => { const s = new Date(a.startAt); return s.getMonth() === d.getMonth() && s.getFullYear() === d.getFullYear(); });
    cutsByMonth.push({ label: MONTHS[d.getMonth()], value: inMonth.length });
    incomeByMonth.push({ label: MONTHS[d.getMonth()], value: Math.round(inMonth.reduce((x, a) => x + a.priceCents, 0) / 100000) });
  }

  const busyHours: { label: string; value: number }[] = [];
  for (let h = 9; h < 20; h++) busyHours.push({ label: `${h}h`, value: hours.get(h) ?? 0 });

  return {
    totalCuts: completed.length,
    incomeCents,
    expensesCents,
    netCents: incomeCents - expensesCents,
    commissionsCents,
    grossProfitCents: incomeCents - commissionsCents,
    upcomingCount, todayCount, clientsCount, locationsCount,
    avgRating: reviewsAgg._avg.rating ?? 0,
    reviewsCount: reviewsAgg._count,
    topBarbersByCuts: agg(barbers).sort(byCount).slice(0, 5),
    topBarbersByIncome: agg(barbers).sort(bySum).slice(0, 5),
    topServices: agg(services).sort(byCount).slice(0, 5),
    topClients: agg(clients).sort(byCount).slice(0, 5),
    perLocation: agg(locations).sort(bySum),
    cutsByMonth, incomeByMonth, busyHours,
  };
}
