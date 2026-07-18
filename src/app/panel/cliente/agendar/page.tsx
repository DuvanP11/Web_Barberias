import { CalendarPlus } from "lucide-react";
import { requireRole, ROLES } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/booking/BookingForm";

export default async function AgendarPage({
  searchParams,
}: {
  searchParams: Promise<{ reagendar?: string }>;
}) {
  const session = await requireRole(ROLES.CLIENT);
  const { reagendar } = await searchParams;

  const [locations, services, barbers, appointment] = await Promise.all([
    prisma.location.findMany({ where: { tenantId: session.tenantId, active: true }, orderBy: { createdAt: "asc" } }),
    prisma.service.findMany({ where: { tenantId: session.tenantId, active: true }, orderBy: { createdAt: "asc" } }),
    prisma.barberProfile.findMany({ where: { tenantId: session.tenantId, active: true }, include: { user: true }, orderBy: { rating: "desc" } }),
    reagendar
      ? prisma.appointment.findFirst({ where: { id: reagendar, clientId: session.uid, tenantId: session.tenantId } })
      : Promise.resolve(null),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-morado to-naranja text-white">
          <CalendarPlus className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">
            {appointment ? "Reprogramar cita" : "Agendar cita"}
          </h1>
          <p className="text-sm text-mist">Elige sede, servicio, barbero y un horario disponible.</p>
        </div>
      </div>

      <div className="card-premium mt-8 p-6 md:p-8">
        <BookingForm
          locations={locations.map((l) => ({ id: l.id, name: l.name }))}
          services={services.map((s) => ({ id: s.id, name: s.name, priceCents: s.priceCents, durationMin: s.durationMin }))}
          barbers={barbers.map((b) => ({ id: b.id, name: `${b.user.firstName} ${b.user.lastName}`, specialty: b.specialty }))}
          rescheduleId={appointment?.id}
          initial={
            appointment
              ? { locationId: appointment.locationId, serviceId: appointment.serviceId, barberId: appointment.barberId }
              : undefined
          }
        />
      </div>
    </div>
  );
}
