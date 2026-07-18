import { requireSession, ROLE_LABELS, type Role } from "@/lib/rbac";
import { prisma, hasDatabase } from "@/lib/prisma";
import { ProfileForm } from "@/components/panel/ProfileForm";

/** Perfil del usuario en sesión — editable. */
export default async function PerfilPage() {
  const session = await requireSession();
  const user = hasDatabase ? await prisma.user.findUnique({ where: { id: session.uid } }) : null;

  const birthDate = user?.birthDate ? new Date(user.birthDate).toISOString().slice(0, 10) : "";

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-cloud md:text-3xl">Mi perfil</h1>
      <p className="mt-1 text-sm text-mist">
        Rol: {ROLE_LABELS[session.role as Role] ?? session.role}. Actualiza tus datos cuando quieras.
      </p>

      <div className="mt-6">
        <ProfileForm
          firstName={user?.firstName ?? ""}
          lastName={user?.lastName ?? ""}
          email={user?.email ?? session.email}
          phone={user?.phone ?? ""}
          birthDate={birthDate}
          address={user?.address ?? ""}
          role={session.role}
          points={user?.points ?? 0}
        />
      </div>
    </div>
  );
}
