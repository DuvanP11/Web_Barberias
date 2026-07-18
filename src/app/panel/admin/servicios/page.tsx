import { Scissors, Plus, Save, Trash2, Eye, EyeOff } from "lucide-react";
import { requireRole, ROLES } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { createService, updateService, toggleService, deleteService } from "./actions";

const input = "w-full rounded-lg border border-line bg-surface/50 px-3 py-2 text-sm text-cloud focus:border-morado/60 focus:outline-none";

export default async function ServiciosAdminPage() {
  const session = await requireRole(ROLES.ADMIN, ROLES.OWNER);
  const services = await prisma.service.findMany({ where: { tenantId: session.tenantId }, orderBy: { createdAt: "asc" } });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-morado to-naranja text-white"><Scissors className="h-5 w-5" /></span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">Servicios</h1>
          <p className="text-sm text-mist">Crea, edita, activa o elimina los servicios del catálogo.</p>
        </div>
      </div>

      {/* Crear */}
      <form action={createService} className="card-premium mt-6 grid gap-3 p-5 sm:grid-cols-[1.4fr_1fr_0.8fr_0.8fr_auto]">
        <input name="name" required placeholder="Nombre" className={input} />
        <input name="category" placeholder="Categoría" className={input} />
        <input name="price" type="number" min="0" step="500" required placeholder="Precio $" className={input} />
        <input name="durationMin" type="number" min="5" step="5" required placeholder="Min" className={input} />
        <button className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-morado to-naranja px-4 py-2 text-sm font-medium text-white"><Plus className="h-4 w-4" /> Crear</button>
      </form>

      {/* Lista editable */}
      <div className="mt-4 space-y-2">
        {services.map((s) => (
          <div key={s.id} className={`card-premium p-4 ${!s.active ? "opacity-60" : ""}`}>
            <form action={updateService} className="grid items-center gap-3 sm:grid-cols-[1.4fr_1fr_0.8fr_0.8fr_auto]">
              <input type="hidden" name="id" value={s.id} />
              <input name="name" defaultValue={s.name} className={input} />
              <input name="category" defaultValue={s.category ?? ""} placeholder="Categoría" className={input} />
              <input name="price" type="number" min="0" step="500" defaultValue={s.priceCents / 100} className={input} />
              <input name="durationMin" type="number" min="5" step="5" defaultValue={s.durationMin} className={input} />
              <button className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm text-cloud hover:border-morado/50"><Save className="h-4 w-4" /> Guardar</button>
            </form>
            <div className="mt-2 flex items-center gap-2">
              <form action={toggleService}>
                <input type="hidden" name="id" value={s.id} />
                <button className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs text-mist hover:text-cloud">
                  {s.active ? <><EyeOff className="h-3.5 w-3.5" /> Desactivar</> : <><Eye className="h-3.5 w-3.5" /> Activar</>}
                </button>
              </form>
              <form action={deleteService}>
                <input type="hidden" name="id" value={s.id} />
                <button className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 px-3 py-1 text-xs text-red-300 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /> Eliminar</button>
              </form>
              {!s.active && <span className="text-xs text-mist-2">Inactivo (no visible al público)</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
