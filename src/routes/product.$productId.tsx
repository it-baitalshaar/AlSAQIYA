import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, MessageCircle, X } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { company, whatsappLink } from "@/lib/company";
import { seedProducts } from "@/lib/products";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const seed = seedProducts.find((p) => p.id === params.productId);
    return { seedName: seed?.name ?? null, seedDescription: seed?.description ?? null };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.seedName
          ? `${loaderData.seedName} | Al Saqiya Trading`
          : "Product | Al Saqiya Trading",
      },
      {
        name: "description",
        content:
          loaderData?.seedDescription ??
          "Porcelain tile and sanitary ware specifications from Al Saqiya Trading, Abu Dhabi.",
      },
      {
        property: "og:title",
        content: loaderData?.seedName
          ? `${loaderData.seedName} | Al Saqiya Trading`
          : "Product | Al Saqiya Trading",
      },
      {
        property: "og:description",
        content:
          loaderData?.seedDescription ??
          "Porcelain tile and sanitary ware specifications from Al Saqiya Trading.",
      },
    ],
  }),
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-32 text-center">
      <h1 className="text-3xl">Product not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        This item may have been renamed or removed from the catalogue.
      </p>
      <Button asChild variant="brand" className="mt-8">
        <Link to="/products">Back to catalogue</Link>
      </Button>
    </div>
  ),
});

function ProductDetail() {
  const { productId } = Route.useParams();
  const { products } = useProducts();
  const product = products.find((p) => p.id === productId);
  const [active, setActive] = useState(0);

  if (!product) {
    // Product may exist only in the local catalogue store on the client.
    if (typeof window === "undefined") throw notFound();
    return (
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-3xl">Product not found</h1>
        <Button asChild variant="brand" className="mt-8">
          <Link to="/products">Back to catalogue</Link>
        </Button>
      </div>
    );
  }

  const images = product.gallery?.length ? product.gallery : [product.image];
  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const specs: Array<[string, string]> = [
    ["Collection", product.collection || "—"],
    ["Category", product.category],
    ["Size", product.size],
    ["Finish", product.finish],
    ["Thickness", product.thickness],
    ["Origin", product.origin],
    ["Application", product.application || "—"],
  ];

  const orderMessage = `Hello Al Saqiya Trading,
I would like to order:

Product: ${product.name}
Size: ${product.size}
Finish: ${product.finish}
Quantity (m²): 

Delivery location: `;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-3.5" /> Catalogue
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden border border-border bg-white">
            {images[active] ? (
              <img
                src={images[active]}
                alt={product.name}
                className="size-full object-contain object-center"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                No image
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`size-20 overflow-hidden border bg-white ${
                    i === active ? "border-primary" : "border-border"
                  }`}
                >
                  <img src={src} alt="" className="size-full object-contain object-center" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-eyebrow text-muted-foreground">{product.collection}</p>
          <h1 className="mt-3 text-4xl">{product.name}</h1>
          <p className="mt-4 text-lg text-primary">{product.price || "Price on request"}</p>

          <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
            {product.inStock ? (
              <>
                <Check className="size-4 text-gold" /> In stock — Mussafah warehouse
              </>
            ) : (
              <>
                <X className="size-4" /> Available on indent order
              </>
            )}
          </p>

          <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

          <dl className="mt-8 divide-y divide-border border-y border-border">
            {specs.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 py-3 text-sm">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="brand" size="lg">
              <a href={whatsappLink(orderMessage)} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" />
                Order on WhatsApp
              </a>
            </Button>
            <Button asChild variant="quiet" size="lg">
              <a
                href={whatsappLink(
                  `Hello Al Saqiya Trading, may I request a sample of ${product.name}?`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                Request a sample
              </a>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Orders and quotations are handled on WhatsApp {company.whatsapp} — no online payment
            required.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="rule-gold text-2xl">More in {product.category}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
