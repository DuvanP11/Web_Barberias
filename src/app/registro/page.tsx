"use client";

import { useActionState } from "react";
import Link from "next/link";
import { UserPlus, AlertCircle } from "lucide-react";
import { register } from "./actions";

const inputClass =
  "w-full rounded-xl border border-line bg-surface/50 px-4 py-3 text-sm text-cloud placeholder:text-mist-2 " +
  "transition-colors focus:border-morado/60 focus:outline-none focus:ring-2 focus:ring-morado/30";
const labelClass = "mb-1.5 block text-sm font-medium text-cloud";

export default function RegistroPage() {
  const [state, formAction, pending] = useActionState(register, {});

  return (
    <div className="container-app flex min-h-[85vh] items-center justify-center py-24">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-morado-light">
            <UserPlus className="h-3.5 w-3.5" /> Crear cuenta
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold text-cloud">Regístrate</h1>
          <p className="mt-2 text-sm text-mist">Crea tu cuenta de cliente para agendar y llevar tu historial.</p>
        </div>

        <form action={formAction} className="card-premium mt-8 space-y-4 p-6 md:p-8">
          {state.error && (
            <p className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="firstName">Nombre</label>
              <input id="firstName" name="firstName" required autoComplete="given-name" placeholder="Juan" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="lastName">Apellido</label>
              <input id="lastName" name="lastName" required autoComplete="family-name" placeholder="Pérez" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="email">Correo</label>
            <input id="email" name="email" type="email" required autoComplete="email" placeholder="tu@correo.com" className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="phone">Celular</label>
            <input id="phone" name="phone" inputMode="tel" autoComplete="tel" placeholder="300 000 0000" className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" required autoComplete="new-password" placeholder="Mínimo 8 caracteres" className={inputClass} />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-morado to-naranja px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-morado/25 transition-all hover:-translate-y-0.5 disabled:opacity-60"
          >
            {pending ? "Creando cuenta…" : "Crear cuenta"}
          </button>

          <p className="text-center text-sm text-mist">
            ¿Ya tienes cuenta?{" "}
            <Link href="/ingresar" className="font-medium text-morado-light hover:text-cloud">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
