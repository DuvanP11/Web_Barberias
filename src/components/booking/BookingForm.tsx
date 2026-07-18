"use client";

import { useActionState, useEffect, useState } from "react";
import { MapPin, Scissors, User, CalendarDays, Clock, AlertCircle, Loader2 } from "lucide-react";
import { submitBooking, type BookingState } from "@/app/panel/cliente/agendar/actions";
import { formatCOP } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Slot } from "@/lib/booking";

export interface BookingLocation { id: string; name: string }
export interface BookingService { id: string; name: string; priceCents: number; durationMin: number }
export interface BookingBarber { id: string; name: string; specialty: string | null }

interface Props {
  locations: BookingLocation[];
  services: BookingService[];
  barbers: BookingBarber[];
  rescheduleId?: string;
  initial?: { locationId?: string; serviceId?: string; barberId?: string };
}

const selectClass =
  "w-full rounded-xl border border-line bg-surface/50 px-4 py-3 text-sm text-cloud " +
  "transition-colors focus:border-morado/60 focus:outline-none focus:ring-2 focus:ring-morado/30";
const labelClass = "mb-1.5 flex items-center gap-2 text-sm font-medium text-cloud";

function todayISO() {
  const d = new Date();
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 10);
}

export function BookingForm({ locations, services, barbers, rescheduleId, initial }: Props) {
  const [locationId, setLocationId] = useState(initial?.locationId ?? locations[0]?.id ?? "");
  const [serviceId, setServiceId] = useState(initial?.serviceId ?? "");
  const [barberId, setBarberId] = useState(initial?.barberId ?? "");
  const [date, setDate] = useState(todayISO());
  const [selectedIso, setSelectedIso] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [state, formAction, pending] = useActionState<BookingState, FormData>(submitBooking, {});

  const ready = serviceId && barberId && date;

  // Carga cupos en tiempo real cuando hay servicio + barbero + fecha.
  useEffect(() => {
    if (!ready) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setSelectedIso("");
    const url = `/api/availability?barberId=${barberId}&serviceId=${serviceId}&date=${date}`;
    fetch(url, { credentials: "same-origin" })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setSlots(d.slots ?? []);
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ready, barberId, serviceId, date]);

  const anyAvailable = slots.some((s) => s.available);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="locationId" value={locationId} />
      <input type="hidden" name="serviceId" value={serviceId} />
      <input type="hidden" name="barberId" value={barberId} />
      <input type="hidden" name="startIso" value={selectedIso} />
      {rescheduleId && <input type="hidden" name="rescheduleId" value={rescheduleId} />}

      {state.error && (
        <p className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </p>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={labelClass}><MapPin className="h-4 w-4 text-morado-light" /> Sede</label>
          <select className={selectClass} value={locationId} onChange={(e) => setLocationId(e.target.value)}>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}><Scissors className="h-4 w-4 text-morado-light" /> Servicio</label>
          <select className={selectClass} value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
            <option value="" disabled>Elige un servicio</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {formatCOP(s.priceCents / 100)} · {s.durationMin} min
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}><User className="h-4 w-4 text-morado-light" /> Barbero</label>
          <select className={selectClass} value={barberId} onChange={(e) => setBarberId(e.target.value)}>
            <option value="" disabled>Elige un barbero</option>
            {barbers.map((b) => (
              <option key={b.id} value={b.id}>{b.name}{b.specialty ? ` · ${b.specialty}` : ""}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}><CalendarDays className="h-4 w-4 text-morado-light" /> Fecha</label>
          <input type="date" className={selectClass} value={date} min={todayISO()} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      {/* Cupos */}
      <div>
        <label className={labelClass}><Clock className="h-4 w-4 text-morado-light" /> Horario disponible</label>
        {!ready ? (
          <p className="rounded-xl border border-line bg-surface/30 px-4 py-6 text-center text-sm text-mist">
            Elige servicio, barbero y fecha para ver los cupos.
          </p>
        ) : loading ? (
          <p className="flex items-center justify-center gap-2 rounded-xl border border-line bg-surface/30 px-4 py-6 text-sm text-mist">
            <Loader2 className="h-4 w-4 animate-spin" /> Buscando disponibilidad…
          </p>
        ) : slots.length === 0 ? (
          <p className="rounded-xl border border-line bg-surface/30 px-4 py-6 text-center text-sm text-mist">
            Ese día no hay atención. Prueba con otra fecha.
          </p>
        ) : !anyAvailable ? (
          <p className="rounded-xl border border-line bg-surface/30 px-4 py-6 text-center text-sm text-mist">
            No quedan cupos libres ese día. Prueba con otra fecha u otro barbero.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {slots.map((s) => (
              <button
                key={s.iso}
                type="button"
                disabled={!s.available}
                onClick={() => setSelectedIso(s.iso)}
                className={cn(
                  "rounded-xl border px-2 py-2.5 text-sm transition-colors",
                  !s.available
                    ? "cursor-not-allowed border-line/50 bg-transparent text-mist-2 line-through"
                    : selectedIso === s.iso
                      ? "border-morado bg-morado/20 text-cloud"
                      : "border-line bg-white/[0.02] text-cloud hover:border-morado/50",
                )}
              >
                {s.time}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!selectedIso || pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-morado to-naranja px-8 py-4 text-base font-medium text-white shadow-lg shadow-morado/25 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
      >
        {pending ? "Confirmando…" : rescheduleId ? "Reprogramar cita" : "Confirmar cita"}
      </button>
    </form>
  );
}
