import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id }}
      className="group block overflow-hidden border border-border bg-card shadow-soft transition-shadow hover:shadow-lift"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="size-full object-contain object-center"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        <span className="absolute left-0 top-3 max-w-[70%] bg-primary-deep px-3 py-1 text-[0.6rem] font-semibold uppercase leading-snug tracking-widest text-primary-foreground">
          {product.category}
        </span>
        {!product.inStock && (
          <span className="absolute right-4 top-4 bg-background/95 px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground">
            On order
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="text-eyebrow text-[0.6rem] text-muted-foreground">{product.collection}</p>
        <h3 className="mt-2 text-xl">{product.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {product.size} · {product.finish} · {product.thickness}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm font-semibold text-primary">{product.price || "On request"}</span>
          <span className="text-xs uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-primary">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
