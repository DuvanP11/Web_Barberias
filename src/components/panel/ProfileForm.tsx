"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { updateProfile, type ProfileState } from "@/app/panel/perfil/actions";

const inputClass =
  "w-full rounded-xl border border-line bg-surface/50 px-4 py-3 text-sm text-cloud placeholder:text-mist-2 " +
  "transition-colors focus:border-morado/60 focus:outline-none focus:ring-2 focus:ring-morado/30";
const labelClass = "mb-1.5 block text-sm font-medium text-cloud";

interface Props {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string; // YYYY-MM-DD o ""
  address: string;
  role: string;
  points: number;
}

export function ProfileForm(p: Props) {
  const [state, formAction, pending] = useActionState<ProfileState, FormData>(updateProfile, {});

  return (
    <form action={formAction} className="card-premium space-y-5 p-6 md:p-8">
      {state.ok && (
        <p className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <CheckCircle2 className="h-4 w-4" /> Datos actualizados.
        </p>
      )}
      {state.error && (
        <p className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4" /> {state.error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="firstName">Nombre</label>
          <input id="firstName" name="firstName" required defaultValue={p.firstName} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="lastName">Apellido</label>
          <input id="lastName" name="lastName" required defaultValue={p.lastName} className={inputClass} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="phone">Celular</label>
          <input id="phone" name="phone" inputMode="tel" defaultValue={p.phone} placeholder="300 000 0000" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="birthDate">Fecha de nacimiento</label>
          <input id="birthDate" name="birthDate" type="date" defaultValue={p.birthDate} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="address">Dirección</label>
        <input id="address" name="address" defaultValue={p.address} placeholder="Tu dirección" className={inputClass} />
      </div>

      {/* Solo lectura */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Correo</label>
          <input value={p.email} disabled className={`${inputClass} opacity-60`} />
        </div>
        <div>
          <label className={labelClass}>Puntos de fidelidad</label>
          <input value={`${p.points} pts`} disabled className={`${inputClass} opacity-60`} />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-morado to-naranja px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-morado/25 transition-all hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
