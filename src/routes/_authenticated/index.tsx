// Página Home (dashboard sencillo tras iniciar sesión).
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Inicio — Catálogo" },
      { name: "description", content: "Bienvenido al catálogo de productos." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { user } = Route.useRouteContext();

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Hola{user.email ? `, ${user.email.split("@")[0]}` : ""} 👋
        </h1>
        <p className="mt-2 text-muted-foreground">
          Bienvenido al catálogo. Explora los productos disponibles.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/products"
          className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary"
        >
          <h2 className="text-lg font-semibold text-foreground">Ver productos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Explora todo el catálogo disponible.
          </p>
        </Link>
        <Link
          to="/profile"
          className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary"
        >
          <h2 className="text-lg font-semibold text-foreground">Mi perfil</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Consulta la información de tu cuenta.
          </p>
        </Link>
      </div>
    </section>
  );
}
