// Detalle de un producto.
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchProductById, type Product } from "@/services/products";
import { Loader } from "@/components/Loader";

export const Route = createFileRoute("/_authenticated/products/$id")({
  head: () => ({
    meta: [
      { title: "Detalle de producto — Catálogo" },
      { name: "description", content: "Información detallada del producto." },
    ],
  }),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { id } = Route.useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchProductById(id)
      .then(setProduct)
      .catch((err) => setError(err.message ?? "Error al cargar"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Cargando producto..." />;

  if (error) {
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/10 p-6 text-destructive">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-md border border-border bg-card p-10 text-center text-muted-foreground">
        <p>Producto no encontrado.</p>
        <Link to="/products" className="mt-3 inline-block text-sm text-primary hover:underline">
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <article className="grid gap-8 md:grid-cols-2">
      <div className="overflow-hidden rounded-xl border border-border bg-muted">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex aspect-square items-center justify-center text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground">
          ← Volver a productos
        </Link>

        {product.category && (
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {product.category}
          </span>
        )}
        <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
        <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>

        {product.description && (
          <p className="leading-relaxed text-muted-foreground">{product.description}</p>
        )}
      </div>
    </article>
  );
}
