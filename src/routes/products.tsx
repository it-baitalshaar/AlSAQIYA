import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { categories } from "@/lib/products";

const searchSchema = z.object({
  category: z.string().optional(),
});

export const Route = createFileRoute("/products")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Tile & Porcelain Catalogue | Al Saqiya Trading" },
      {
        name: "description",
        content:
          "Browse Al Saqiya Trading's catalogue: wall tiles, floor tiles, outdoor porcelain slabs, wood-look porcelain and sanitary ware in stock in Abu Dhabi.",
      },
      { property: "og:title", content: "Tile & Porcelain Catalogue | Al Saqiya Trading" },
      {
        property: "og:description",
        content: "Wall, floor, outdoor and wood-look porcelain stocked in Mussafah, Abu Dhabi.",
      },
    ],
  }),
  component: Products,
});

function Products() {
  const { category } = Route.useSearch();
  const { products } = useProducts();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchCat = !category || p.category === category;
      const matchQuery =
        !q ||
        [p.name, p.collection, p.size, p.finish, p.origin, p.description]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchCat && matchQuery;
    });
  }, [products, category, query]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <p className="text-eyebrow text-muted-foreground">Catalogue</p>
      <h1 className="rule-gold mt-3 text-4xl">
        {category ?? "All surfaces"}
        <span className="ml-3 align-middle text-base text-muted-foreground">
          {filtered.length} item{filtered.length === 1 ? "" : "s"}
        </span>
      </h1>

      <div className="mt-10 flex flex-col gap-4 border-y border-border py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <Link
            to="/products"
            className={`px-3 py-1.5 text-xs uppercase tracking-widest transition-colors ${
              !category
                ? "bg-primary text-primary-foreground"
                : "border border-border hover:border-primary/40"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              to="/products"
              search={{ category: c }}
              className={`px-3 py-1.5 text-xs uppercase tracking-widest transition-colors ${
                category === c
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:border-primary/40"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, size or finish…"
          className="lg:max-w-xs"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-24 text-center text-sm text-muted-foreground">
          No products match this filter yet.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
