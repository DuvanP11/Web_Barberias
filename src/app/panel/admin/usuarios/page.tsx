import { UserCog, Plus, CheckCircle2, Ban } from "lucide-react";
import { requireRole, ROLES, ROLE_LABELS, type Role } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { createStaff, toggleUserActive, changeUserRole } from "./actions";

const input = "w-full rounded-lg border border-line bg-surface/50 px-3 py-2 text-sm text-cloud focus:border-morado/60 focus:outline-none";

export default async function UsuariosAdminPage() {
  const session = await requireRole(ROLES.ADMIN, ROLES.OWNER);
  const isOwner = session.role === ROLES.OWNER;
  const staff = await prisma.user.findMany({
    where: { tenantId: session.tenantId, role: { in: isOwner ? ["BARBER", "ADMIN", "OWNER"] : ["BARBER", "ADMIN"] } },
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
  });

  const roleOptions = isOwner ? ["BARBER", "ADMIN", "OWNER"] : ["BARBER", "ADMIN"];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-morado to-naranja text-white"><UserCog className="h-5 w-5" /></span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">Personal</h1>
          <p className="text-sm text-mist">Barberos y administradores del negocio.</p>
        </div>
      </div>

      {/* Crear */}
      <form action={createStaff} className="card-premium mt-6 grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <input name="firstName" required placeholder="Nombre" className={input} />
        <input name="lastName" required placeholder="Apellido" className={input} />
        <input name="email" type="email" required placeholder="Correo" className={input} />
        <input name="phone" placeholder="Celular" className={input} />
        <select name="role" className={input} defaultValue="BARBER">
          {roleOptions.map((r) => <option key={r} value={r}>{ROLE_LABELS[r as Role]}</option>)}
        </select>
        <input name="password" type="password" required minLength={8} placeholder="Contraseña (mín. 8)" className={input} />
        <button className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-morado to-naranja px-4 py-2 text-sm font-medium text-white sm:col-span-2 lg:col-span-1"><Plus className="h-4 w-4" /> Crear</button>
      </form>

      {/* Lista */}
      <div className="mt-4 space-y-2">
        {staff.map((u) => (
          <div key={u.id} className={`card-premium flex flex-wrap items-center gap-3 p-4 ${!u.active ? "opacity-60" : ""}`}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-morado to-naranja text-xs font-bold text-white">
              {(u.firstName[0] ?? "") + (u.lastName[0] ?? "")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-cloud">{u.firstName} {u.lastName}</p>
              <p className="truncate text-xs text-mist">{u.email}</p>
            </div>
            <form action={changeUserRole} className="flex items-center gap-2">
              <input type="hidden" name="id" value={u.id} />
              <select name="role" defaultValue={u.role} disabled={u.id === session.uid} className="rounded-lg border border-line bg-surface/50 px-2 py-1.5 text-xs text-cloud">
                {roleOptions.map((r) => <option key={r} value={r}>{ROLE_LABELS[r as Role]}</option>)}
              </select>
              <button disabled={u.id === session.uid} className="rounded-lg border border-line px-2.5 py-1.5 text-xs text-cloud hover:border-morado/50 disabled:opacity-40">Aplicar</button>
            </form>
            <form action={toggleUserActive}>
              <input type="hidden" name="id" value={u.id} />
              <button disabled={u.id === session.uid} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs disabled:opacity-40 ${u.active ? "border-red-500/30 text-red-300 hover:bg-red-500/10" : "border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"}`}>
                {u.active ? <><Ban className="h-3.5 w-3.5" /> Bloquear</> : <><CheckCircle2 className="h-3.5 w-3.5" /> Activar</>}
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
