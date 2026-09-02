import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/company";
import { catalogImages } from "@/lib/catalog-images";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Al Saqiya Trading | Tile Importer in Abu Dhabi" },
      {
        name: "description",
        content:
          "Al Saqiya Trading L.L.C. has imported and supplied tiles, porcelain and sanitary ware from Mussafah, Abu Dhabi since 1991. Licence CN-1021313.",
      },
      { property: "og:title", content: "About Al Saqiya Trading" },
      {
        property: "og:description",
        content:
          "A licensed Abu Dhabi importer of tiles, porcelain slabs and sanitary ware, trading since 1991.",
      },
    ],
  }),
  component: About,
});

const facts: Array<[string, string]> = [
  ["Trade name", company.legalName],
  ["Licence number", company.licenceNo],
  ["Legal form", "Limited Liability Company — Sole Proprietorship"],
  ["Established", "19 September 1991"],
  ["Licensing authority", "Abu Dhabi Registration Authority (ADRA)"],
  ["Chamber membership", "ADCCI 7364"],
  ["Address", company.addressEn],
];

function About() {
  return (
    <>
      <section className="surface-navy">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <p className="text-eyebrow text-gold">The company</p>
            <h1 className="mt-5 text-4xl md:text-5xl">
              Three decades of supplying the surfaces of Abu Dhabi.
            </h1>
            <p className="mt-6 leading-relaxed opacity-85">
              {company.legalName} was established in 1991 and operates from Mussafah Industrial,
              Abu Dhabi. We import and retail ceramic and porcelain tiles, large-format slabs,
              outdoor paving and sanitary ware — supplying contractors, consultants, interior
              fit-out firms and private villa owners across the Emirates.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img
              src={catalogImages.tile1}
              alt="Interior finished in Al Saqiya porcelain tiles"
              className="h-72 w-full object-cover"
            />
            <img
              src={catalogImages.tile8}
              alt="Outdoor terrace paved with Al Saqiya porcelain slabs"
              className="h-72 w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-2">
        <div>
          <h2 className="rule-gold text-3xl">What we do</h2>
          <ul className="mt-8 space-y-6">
            {company.activities.map((a) => (
              <li key={a} className="border-l-2 border-gold pl-5">
                <p className="font-display text-xl">{a}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Licensed activity under Abu Dhabi Economic Licence {company.licenceNo}.
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-8 leading-relaxed text-muted-foreground">
            Beyond stock supply, our team helps match shade lots across phases, advises on
            thickness and slip ratings for the intended area, and coordinates delivery schedules
            with site progress.
          </p>
        </div>

        <div className="border border-border bg-card p-8 shadow-soft">
          <h2 className="text-2xl">Registration details</h2>
          <dl className="mt-6 divide-y divide-border">
            {facts.map(([k, v]) => (
              <div key={k} className="py-4">
                <dt className="text-eyebrow text-[0.6rem] text-muted-foreground">{k}</dt>
                <dd className="mt-1 text-sm">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="brand">
              <Link to="/products">View catalogue</Link>
            </Button>
            <Button asChild variant="quiet">
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
