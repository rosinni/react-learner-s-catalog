// Barra de navegación superior.
import { Link, useNavigate } from "@tanstack/react-router";
import { signOut } from "@/services/auth";

export function Navbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate({ to: "/auth", replace: true });
  }

  const linkClass =
    "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
  const activeProps = { className: "text-sm font-semibold text-foreground" };

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-foreground">
          Catálogo
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" activeOptions={{ exact: true }} activeProps={activeProps} className={linkClass}>
            Home
          </Link>
          <Link to="/products" activeProps={activeProps} className={linkClass}>
            Productos
          </Link>
          <Link to="/profile" activeProps={activeProps} className={linkClass}>
            Perfil
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
    </header>
  );
}
