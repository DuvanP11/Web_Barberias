import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLES, APPOINTMENT_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/roles";

/** GET /api/reportes?type=citas|ingresos|clientes → CSV. Requiere staff. */
function csv(rows: (string | number)[][]) {
  return rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\r\n");
}
const money = (cents: number) => (cents / 100).toFixed(0);
const date = (d: Date) => new Date(d).toLocaleString("es-CO", { timeZone: "America/Bogota" });

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || (session.role !== ROLES.ADMIN && session.role !== ROLES.OWNER)) {
    return new Response("No autorizado", { status: 401 });
  }
  const type = new URL(request.url).searchParams.get("type") ?? "citas";
  const t = session.tenantId;
  let rows: (string | number)[][] = [];
  let filename = "reporte.csv";

  if (type === "citas") {
    filename = "citas.csv";
    const appts = await prisma.appointment.findMany({
      where: { tenantId: t },
      include: { client: true, service: true, location: true, barber: { include: { user: true } } },
      orderBy: { startAt: "desc" },
    });
    rows = [["Fecha", "Cliente", "Barbero", "Servicio", "Sede", "Estado", "Precio"]];
    for (const a of appts) rows.push([date(a.startAt), `${a.client.firstName} ${a.client.lastName}`, `${a.barber.user.firstName} ${a.barber.user.lastName}`, a.service.name, a.location.name, APPOINTMENT_STATUS_LABELS[a.status] ?? a.status, money(a.priceCents)]);
  } else if (type === "ingresos") {
    filename = "ingresos.csv";
    const pays = await prisma.payment.findMany({ where: { tenantId: t }, include: { appointment: { include: { service: true, barber: { include: { user: true } } } } }, orderBy: { createdAt: "desc" } });
    rows = [["Fecha", "Servicio", "Barbero", "Método", "Estado", "Monto"]];
    for (const p of pays) rows.push([date(p.createdAt), p.appointment?.service.name ?? "—", p.appointment ? `${p.appointment.barber.user.firstName} ${p.appointment.barber.user.lastName}` : "—", PAYMENT_METHOD_LABELS[p.method] ?? p.method, p.status, money(p.amountCents)]);
  } else if (type === "clientes") {
    filename = "clientes.csv";
    const clients = await prisma.user.findMany({ where: { tenantId: t, role: "CLIENT" }, orderBy: { createdAt: "desc" } });
    rows = [["Nombre", "Correo", "Celular", "Puntos", "Registrado"]];
    for (const c of clients) rows.push([`${c.firstName} ${c.lastName}`, c.email, c.phone ?? "", c.points, date(c.createdAt)]);
  }

  return new Response("﻿" + csv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
