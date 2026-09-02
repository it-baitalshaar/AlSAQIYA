import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Package, ShieldCheck, Truck } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { company, whatsappLink } from "@/lib/company";
import { categories } from "@/lib/products";
import { catalogImages } from "@/lib/catalog-images";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Al Saqiya Trading | Porcelain Tiles & Sanitary Ware in Abu Dhabi" },
      {
        name: "description",
        content:
          "Large-format porcelain, wall and floor tiles, outdoor slabs and sanitary ware. Supplying Abu Dhabi and the UAE since 1991. Order on WhatsApp.",
      },
      { property: "og:title", content: "Al Saqiya Trading | Tiles & Sanitary Ware" },
      {
        property: "og:description",
        content:
          "Curated porcelain tiles, outdoor slabs and sanitary ware from our Mussafah, Abu Dhabi warehouse.",
      },
    ],
  }),
  component: Home,
});

const pillars = [
  {
    icon: Package,
    title: "Stocked in Mussafah",
    body: "Full pallets ready for same-week collection or delivery — no long import waits on stocked lines.",
  },
  {
    icon: ShieldCheck,
    title: "Licensed importer",
    body: `Economic Licence ${company.licenceNo} covering import and retail of tiles and sanitary ware.`,
  },
  {
    icon: Truck,
    title: "UAE-wide delivery",
    body: "Site delivery across Abu Dhabi, Al Ain, Dubai and the Northern Emirates.",
  },
  {
    icon: Building2,
    title: "Project supply",
    body: "Villas, hotels and fit-outs: batch-matched shade lots and dedicated project pricing.",
  },
];

function Home() {
  const { products } = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={catalogImages.tile1}
          alt="Bathroom finished in Harmony Bianco porcelain tiles"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary-deep/95 via-primary-deep/70 to-primary-deep/10" />
        <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-6 py-28 text-primary-foreground md:py-40">
          <p className="text-eyebrow text-gold">Abu Dhabi · Since {company.establishedYear}</p>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.1] sm:text-5xl md:text-6xl">
            Surfaces that hold their line, from the first slab to the last cut.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed opacity-90">
            {company.legalName} imports and supplies large-format porcelain, wall and floor tiles,
            outdoor paving slabs and sanitary ware for villas, hotels and commercial fit-outs across
            the UAE.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="gold" size="lg">
              <Link to="/products">
                Browse the catalogue
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-primary-foreground uppercase tracking-wide text-xs font-semibold hover:bg-white/10 hover:text-primary-foreground"
            >
              <a
                href={whatsappLink("Hello Al Saqiya Trading, I'd like a quotation for tiles.")}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp a quotation
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.title}>
              <p.icon className="size-6 text-gold" />
              <h3 className="mt-4 text-lg">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-eyebrow text-muted-foreground">Ranges</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-xl text-3xl md:text-4xl">Everything for the finished surface</h2>
          <Link
            to="/products"
            className="text-sm uppercase tracking-widest text-primary hover:underline"
          >
            All products →
          </Link>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c}
              to="/products"
              search={{ category: c }}
              className="group border border-border bg-card p-6 transition-colors hover:border-primary/40 hover:bg-secondary"
            >
              <span className="block font-display text-xl">{c}</span>
              <span className="mt-8 block text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-secondary/60 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-eyebrow text-muted-foreground">In stock now</p>
          <h2 className="rule-gold mt-3 text-3xl md:text-4xl">Featured surfaces</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Outdoor split */}
      <section className="mx-auto grid max-w-7xl items-stretch gap-0 px-6 py-20 lg:grid-cols-2">
        <div className="order-2 flex flex-col justify-center bg-primary-deep p-10 text-primary-foreground md:p-16 lg:order-1">
          <p className="text-eyebrow text-gold">Outdoor programme</p>
          <h2 className="mt-4 text-3xl md:text-4xl">18 & 20 mm structural porcelain</h2>
          <p className="mt-5 text-sm leading-relaxed opacity-85">
            UAE-manufactured heavy-gauge slabs with R9 anti-slip finishes, engineered for terraces,
            pool surrounds, courtyards and pedestal roof decks. Available in matt stone and cement
            tones, 60×120 format.
          </p>
          <div className="mt-8">
            <Button asChild variant="gold">
              <Link to="/products" search={{ category: "Outdoor Porcelain" }}>
                See outdoor range
              </Link>
            </Button>
          </div>
        </div>
        <div className="order-1 grid grid-cols-2 gap-0 lg:order-2">
          <img src={catalogImages.tile3} alt="Outdoor porcelain walkway" className="size-full object-cover" />
          <img
            src={catalogImages.tile8}
            alt="20 mm porcelain terrace paving with gravel joints"
            className="size-full object-cover"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-4">
        <div className="border border-border bg-card p-10 text-center shadow-soft md:p-16">
          <h2 className="text-3xl md:text-4xl">Send us your tile schedule</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Share your areas, sizes and quantities on WhatsApp — our team replies with availability
            and pricing on the same working day.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="brand" size="lg">
              <Link to="/order">How to order</Link>
            </Button>
            <Button asChild variant="quiet" size="lg">
              <a
                href={whatsappLink("Hello Al Saqiya Trading, here is my tile requirement:")}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp {company.whatsapp}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
