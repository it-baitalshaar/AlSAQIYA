import { Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { company, companyLogo, whatsappLink } from "@/lib/company";

const catalogue = ["Wall Tiles", "Floor Tiles", "Outdoor Porcelain", "Wood Look", "Sanitary Ware"];

const companyLinks = [
  { to: "/about", label: "About Al Saqiya" },
  { to: "/order", label: "How to order" },
  { to: "/contact", label: "Showroom & contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="surface-navy mt-24">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-4">
              <img
                src={companyLogo}
                alt="Al Saqiya Trading logo"
                className="h-[4.25rem] w-auto object-contain invert hue-rotate-180"
              />
              <span>
                <span className="block font-display text-xl leading-tight tracking-wide">
                  {company.nameEn}
                </span>
                <span className="mt-1 block text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold">
                  {company.nameAr}
                </span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">
              Importing and supplying tiles, porcelain slabs and sanitary ware across the UAE since{" "}
              {company.establishedYear}.
            </p>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-eyebrow text-gold">Catalogue</h3>
            <ul className="mt-5 space-y-2.5 text-sm text-white/80">
              {catalogue.map((c) => (
                <li key={c}>
                  <Link
                    to="/products"
                    search={{ category: c }}
                    className="transition-colors hover:text-gold"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-eyebrow text-gold">Company</h3>
            <ul className="mt-5 space-y-2.5 text-sm text-white/80">
              {companyLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="transition-colors hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-eyebrow text-gold">Get in touch</h3>
            <ul className="mt-5 space-y-3.5 text-sm text-white/80">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
                <span>{company.addressEn}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-gold" />
                <a href={`tel:${company.phone}`} className="hover:text-gold">
                  {company.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-gold" />
                <a
                  href={whatsappLink("Hello Al Saqiya Trading")}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold"
                >
                  {company.whatsapp}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-gold" />
                <a href={`mailto:${company.email}`} className="hover:text-gold">
                  {company.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-[0.7rem] text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <p>
            Economic Licence {company.licenceNo} · Abu Dhabi Registration Authority · {company.hours}
          </p>
        </div>
      </div>
    </footer>
  );
}
