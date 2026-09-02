import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import { company, companyLogo, whatsappLink } from "@/lib/company";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Catalogue" },
  { to: "/about", label: "Company" },
  { to: "/order", label: "Order" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-md">
      <div className="hidden border-b border-border/60 bg-primary-deep text-primary-foreground md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs">
          <p className="tracking-wide opacity-90">
            Licence {company.licenceNo} · Abu Dhabi · Trading since {company.establishedYear}
          </p>
          <div className="flex items-center gap-6">
            <a
              href={`tel:${company.phone}`}
              className="inline-flex items-center gap-2 opacity-90 transition-opacity hover:opacity-100"
            >
              <Phone className="size-3.5" />
              {company.phone}
            </a>
            <a
              href={whatsappLink("Hello Al Saqiya Trading, I would like an enquiry.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 opacity-90 transition-opacity hover:opacity-100"
            >
              <MessageCircle className="size-3.5" />
              {company.whatsapp}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={companyLogo}
            alt="Al Saqiya Trading logo"
            className="h-14 w-auto shrink-0 object-contain sm:h-16"
          />
          <span className="hidden sm:block">
            <span className="block font-display text-lg leading-tight">{company.nameEn}</span>
            <span className="text-eyebrow block text-[0.6rem] text-muted-foreground">
              Tiles · Porcelain · Sanitary
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm tracking-wide text-foreground/80 transition-colors hover:text-primary [&.active]:text-primary [&.active]:underline [&.active]:decoration-gold [&.active]:decoration-2 [&.active]:underline-offset-8"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="brand" size="sm" className="hidden sm:inline-flex">
            <a
              href={whatsappLink("Hello Al Saqiya Trading, I would like to request a quotation.")}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="size-4" />
              Request quote
            </a>
          </Button>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-sm border border-border lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-6 py-2">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3 text-sm last:border-0 [&.active]:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
