// Perfil del usuario. Muestra información básica de la cuenta.
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { signOut } from "@/services/auth";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Perfil — Catálogo" },
      { name: "description", content: "Información de tu cuenta." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <section className="max-w-md">
      <h1 className="text-3xl font-bold text-foreground">Mi perfil</h1>
      <p className="mt-1 text-sm text-muted-foreground">Datos de tu cuenta.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <dl className="flex flex-col gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="mt-1 font-medium text-foreground">{user.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">ID de usuario</dt>
            <dd className="mt-1 break-all font-mono text-xs text-foreground">{user.id}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Miembro desde</dt>
            <dd className="mt-1 font-medium text-foreground">
              {new Date(user.created_at).toLocaleDateString()}
            </dd>
          </div>
        </dl>

        <button
          onClick={handleLogout}
          className="mt-6 w-full rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
        >
          Cerrar sesión
        </button>
      </div>
    </section>
  );
}
