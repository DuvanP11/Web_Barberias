import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAvailability } from "@/lib/booking";

/**
 * GET /api/availability?barberId=&serviceId=&date=YYYY-MM-DD
 * Devuelve los cupos del día para ese barbero/servicio. Requiere sesión; el
 * tenant sale de la sesión (no se puede consultar otra barbería).
 */
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const barberId = searchParams.get("barberId");
  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date");

  if (!barberId || !serviceId || !date) {
    return NextResponse.json({ slots: [] });
  }

  const slots = await getAvailability(session.tenantId, barberId, serviceId, date);
  return NextResponse.json({ slots });
}
