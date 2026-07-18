"use client";

import { useActionState } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { updateTenant, type ConfigState } from "@/app/panel/admin/configuracion/actions";

const input = "w-full rounded-xl border border-line bg-surface/50 px-4 py-3 text-sm text-cloud focus:border-morado/60 focus:outline-none";
const label = "mb-1.5 block text-sm font-medium text-cloud";

export function ConfigForm({ name, primaryColor }: { name: string; primaryColor: string }) {
  const [state, action, pending] = useActionState<ConfigState, FormData>(updateTenant, {});
  return (
    <form action={action} className="card-premium space-y-5 p-6 md:p-8">
      {state.ok && (
        <p className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <CheckCircle2 className="h-4 w-4" /> Configuración guardada.
        </p>
      )}
      <div>
        <label className={label} htmlFor="name">Nombre del negocio</label>
        <input id="name" name="name" required defaultValue={name} className={input} />
      </div>
      <div>
        <label className={label} htmlFor="primaryColor">Color principal</label>
        <div className="flex items-center gap-3">
          <input id="primaryColor" name="primaryColor" type="color" defaultValue={primaryColor || "#c9a227"} className="h-11 w-16 cursor-pointer rounded-lg border border-line bg-surface/50" />
          <span className="text-sm text-mist">Se usará como acento de marca del negocio.</span>
        </div>
      </div>
      <button disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-morado to-naranja px-8 py-3.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 disabled:opacity-60">
        <Save className="h-4 w-4" /> {pending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
