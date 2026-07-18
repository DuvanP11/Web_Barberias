"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, ArrowLeft, MailCheck } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-line bg-surface/50 px-4 py-3 text-sm text-cloud placeholder:text-mist-2 " +
  "transition-colors focus:border-morado/60 focus:outline-none focus:ring-2 focus:ring-morado/30";

/**
 * Recuperación de contraseña (interfaz). El envío de correo se conecta en la
 * fase de notificaciones; por ahora confirma la solicitud sin exponer si el
 * correo existe (buena práctica de seguridad).
 */
export default function RecuperarPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="container-app flex min-h-[80vh] items-center justify-center py-24">
      <div className="w-full max-w-md">
        {sent ? (
          <div className="card-premium flex flex-col items-center gap-4 p-8 text-center">
            <MailCheck className="h-12 w-12 text-emerald-400" />
            <h1 className="font-display text-2xl font-semibold text-cloud">Revisa tu correo</h1>
            <p className="text-sm text-mist">
              Si ese correo está registrado, te enviaremos instrucciones para restablecer tu
              contraseña. (El envío de correos se habilita en la fase de notificaciones.)
            </p>
            <Link href="/ingresar" className="mt-2 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-cloud hover:border-morado/50">
              <ArrowLeft className="h-4 w-4" /> Volver a ingresar
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-morado-light">
                <KeyRound className="h-3.5 w-3.5" /> Recuperar acceso
              </span>
              <h1 className="mt-5 font-display text-3xl font-semibold text-cloud">¿Olvidaste tu contraseña?</h1>
              <p className="mt-2 text-sm text-mist">Escribe tu correo y te enviaremos un enlace para restablecerla.</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="card-premium mt-8 space-y-4 p-6 md:p-8"
            >
              <input type="email" name="email" required placeholder="tu@correo.com" className={inputClass} />
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-morado to-naranja px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-morado/25 transition-all hover:-translate-y-0.5"
              >
                Enviar enlace
              </button>
              <Link href="/ingresar" className="block text-center text-sm text-mist hover:text-cloud">Volver a ingresar</Link>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
