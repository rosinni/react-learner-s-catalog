// Listado de productos. Maneja loading, error y sin resultados.
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchProducts, type Product } from "@/services/products";
import { ProductCard } from "@/components/ProductCard";
import { Loader } from "@/components/Loader";

export const Route = createFileRoute("/_authenticated/products")({
  head: () => ({
    meta: [
      { title: "Productos — Catálogo" },
      { name: "description", content: "Listado de productos del catálogo." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message ?? "Error al cargar"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Cargando productos..." />;

  if (error) {
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/10 p-6 text-center text-destructive">
        <p className="font-medium">No pudimos cargar los productos</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Productos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {products.length} {products.length === 1 ? "producto" : "productos"} en el catálogo
        </p>
      </header>

      {products.length === 0 ? (
        <div className="rounded-md border border-border bg-card p-10 text-center text-muted-foreground">
          No hay productos disponibles todavía.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
