"use client";

import { useActionState } from "react";
import Link from "next/link";
import { LogIn, AlertCircle } from "lucide-react";
import { login } from "./actions";

const inputClass =
  "w-full rounded-xl border border-line bg-surface/50 px-4 py-3 text-sm text-cloud placeholder:text-mist-2 " +
  "transition-colors focus:border-morado/60 focus:outline-none focus:ring-2 focus:ring-morado/30";
const labelClass = "mb-1.5 block text-sm font-medium text-cloud";

// Cuentas sembradas por `npm run db:seed` (solo para probar la demo).
const DEMO = [
  { role: "Dueño", email: "dueno@barberiaimperio.com" },
  { role: "Administrador", email: "admin@barberiaimperio.com" },
  { role: "Barbero", email: "barbero@barberiaimperio.com" },
  { role: "Cliente", email: "cliente@barberiaimperio.com" },
];

export default function IngresarPage() {
  const [state, formAction, pending] = useActionState(login, {});

  return (
    <div className="container-app flex min-h-[85vh] items-center justify-center py-24">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-morado-light">
            <LogIn className="h-3.5 w-3.5" /> Acceso
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold text-cloud">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-mist">Ingresa a tu panel de cliente, barbero o administración.</p>
        </div>

        <form action={formAction} className="card-premium mt-8 space-y-4 p-6 md:p-8">
          {state.error && (
            <p className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
            </p>
          )}

          <div>
            <label className={labelClass} htmlFor="email">Correo</label>
            <input id="email" name="email" type="email" required autoComplete="email" placeholder="tu@correo.com" className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" className={inputClass} />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-morado to-naranja px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-morado/25 transition-all hover:-translate-y-0.5 disabled:opacity-60"
          >
            {pending ? "Ingresando…" : "Ingresar"}
          </button>

          <div className="flex items-center justify-between text-sm">
            <Link href="/recuperar" className="text-mist transition-colors hover:text-cloud">¿Olvidaste tu contraseña?</Link>
            <Link href="/registro" className="font-medium text-morado-light hover:text-cloud">Crear cuenta</Link>
          </div>
        </form>

        {/* Ayuda de demostración */}
        <div className="mt-6 rounded-2xl border border-line/60 bg-surface/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-mist-2">Cuentas de demostración</p>
          <p className="mt-1 text-xs text-mist">Contraseña para todas: <span className="font-mono text-cloud">demo1234</span></p>
          <ul className="mt-3 grid gap-1.5">
            {DEMO.map((d) => (
              <li key={d.email} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-mist">{d.role}</span>
                <span className="font-mono text-cloud">{d.email}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
