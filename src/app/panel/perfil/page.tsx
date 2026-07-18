import { User, Mail, Phone, MapPin, Cake, Star, ShieldCheck } from "lucide-react";
import { requireSession, ROLE_LABELS, type Role } from "@/lib/rbac";
import { prisma, hasDatabase } from "@/lib/prisma";

/**
 * Perfil del usuario en sesión (solo lectura por ahora; la edición llega en la
 * fase del panel de cliente). Lee los datos reales desde la base.
 */
export default async function PerfilPage() {
  const session = await requireSession();

  const user = hasDatabase
    ? await prisma.user.findUnique({ where: { id: session.uid } })
    : null;

  const rows = [
    { icon: User, label: "Nombre", value: user ? `${user.firstName} ${user.lastName}` : session.name ?? "—" },
    { icon: Mail, label: "Correo", value: user?.email ?? session.email },
    { icon: Phone, label: "Celular", value: user?.phone || "—" },
    { icon: Cake, label: "Fecha de nacimiento", value: user?.birthDate ? new Date(user.birthDate).toLocaleDateString("es-CO") : "—" },
    { icon: MapPin, label: "Dirección", value: user?.address || "—" },
    { icon: ShieldCheck, label: "Rol", value: ROLE_LABELS[session.role as Role] ?? session.role },
    { icon: Star, label: "Puntos de fidelidad", value: String(user?.points ?? 0) },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">Mi perfil</h1>
      <p className="mt-1 text-sm text-mist">Tus datos. La edición estará disponible en la próxima fase.</p>

      <div className="card-premium mt-6 divide-y divide-line/60">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-4 p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-morado/15 text-morado-light">
              <r.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-mist-2">{r.label}</p>
              <p className="truncate text-sm font-medium text-cloud">{r.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
