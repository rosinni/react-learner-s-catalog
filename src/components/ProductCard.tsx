// Tarjeta de producto. Solo se encarga de mostrar información.
import { Link } from "@tanstack/react-router";
import type { Product } from "@/services/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/products/$id"
      params={{ id: product.id }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-square w-full overflow-hidden bg-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.category && (
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {product.category}
          </span>
        )}
        <h3 className="text-base font-semibold text-foreground">{product.name}</h3>
        <p className="mt-auto text-lg font-bold text-primary">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
