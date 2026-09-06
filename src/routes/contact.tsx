import { createFileRoute } from "@tanstack/react-router";
import { Clock, Facebook, Globe, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactQr } from "@/components/contact-qr";
import { company, telHref, whatsappLink } from "@/lib/company";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Showroom | Al Saqiya Trading, Abu Dhabi" },
      {
        name: "description",
        content:
          "Visit Al Saqiya Trading in Musaffah Industrial M38, Abu Dhabi. Call +971 50 444 3247 or email accountant@alsaqiauae.ae.",
      },
      { property: "og:title", content: "Contact Al Saqiya Trading" },
      {
        property: "og:description",
        content:
          "Musaffah - Musaffah Industrial - M38, Abu Dhabi. Find us on Google Maps, Instagram and Facebook.",
      },
    ],
  }),
  component: Contact,
});

const cards = [
  {
    icon: Phone,
    label: "Mobile",
    value: company.phone,
    href: telHref(company.phone),
  },
  {
    icon: Phone,
    label: "Landline",
    value: company.landline,
    href: telHref(company.landline),
  },
  { icon: Mail, label: "Email", value: company.email, href: `mailto:${company.email}` },
  {
    icon: Globe,
    label: "Website",
    value: company.websiteLabel,
    href: company.website,
  },
  {
    icon: MapPin,
    label: "Main showroom",
    value: `Al Saqiya Trading — ${company.addressEn}`,
    href: company.mapsUrl,
  },
  {
    icon: MapPin,
    label: "Branch",
    value: `Al Saqiya Trading — ${company.branchAddressEn}`,
    href: company.branchMapsUrl,
  },
  { icon: Instagram, label: "Instagram", value: company.instagramHandle, href: company.instagram },
  { icon: Facebook, label: "Facebook", value: company.facebookHandle, href: company.facebook },
  {
    icon: Clock,
    label: "Working hours",
    value: `${company.hours}. ${company.hoursClosed}.`,
  },
];

function Contact() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <p className="text-eyebrow text-muted-foreground">Get in touch</p>
      <h1 className="rule-gold mt-3 text-4xl">Showroom & contact</h1>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((c) => {
            const content = (
              <>
                <c.icon className="size-5 text-gold" />
                <p className="text-eyebrow mt-4 text-[0.6rem] text-muted-foreground">{c.label}</p>
                <p className="mt-1 text-sm leading-relaxed">{c.value}</p>
              </>
            );
            return c.href ? (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="border border-border bg-card p-6 shadow-soft transition-colors hover:border-primary/40"
              >
                {content}
              </a>
            ) : (
              <div key={c.label} className="border border-border bg-card p-6 shadow-soft">
                {content}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-6">
          <div className="surface-navy p-8">
            <h2 className="text-2xl">Fastest way to reach us</h2>
            <p className="mt-3 text-sm leading-relaxed opacity-85">
              Call or WhatsApp {company.phone}, or email {company.email}. Send your tile schedule,
              drawings or a photo of the reference finish and we confirm availability the same
              working day.
            </p>
            <Button asChild variant="gold" className="mt-6">
              <a
                href={whatsappLink("Hello Al Saqiya Trading, I have an enquiry about tiles.")}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="size-4" />
                Chat on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <p className="text-eyebrow text-muted-foreground">Find us</p>
        <h2 className="rule-gold mt-3 text-3xl">Showrooms</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden border border-border bg-card shadow-soft">
            <iframe
              title="Al Saqiya Trading main showroom — Musaffah Industrial M38, Abu Dhabi"
              src={company.mapsEmbed}
              className="h-72 w-full"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <a
              href={company.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="block p-5 transition-colors hover:text-primary"
            >
              <p className="text-eyebrow text-[0.6rem] text-muted-foreground">Main showroom</p>
              <p className="mt-1 text-sm leading-relaxed">
                Al Saqiya Trading — {company.addressEn}
              </p>
              <p className="mt-2 text-xs text-gold">Open in Google Maps</p>
            </a>
          </div>
          <div className="overflow-hidden border border-border bg-card shadow-soft">
            <iframe
              title="Al Saqiya Trading branch — Musaffah Industrial, Abu Dhabi"
              src={company.branchMapsEmbed}
              className="h-72 w-full"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <a
              href={company.branchMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="block p-5 transition-colors hover:text-primary"
            >
              <p className="text-eyebrow text-[0.6rem] text-muted-foreground">Branch</p>
              <p className="mt-1 text-sm leading-relaxed">
                Al Saqiya Trading — {company.branchAddressEn}
              </p>
              <p className="mt-2 text-xs text-gold">Open in Google Maps</p>
            </a>
          </div>
        </div>
      </section>

      <section className="mt-16 border border-border bg-card p-8 shadow-soft">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <p className="text-eyebrow text-muted-foreground">Share our details</p>
            <h2 className="rule-gold mt-3 text-3xl">Contact QR</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Use the same QR on catalogues, invoices and the showroom. It always opens the live
              contact card with our phone numbers, email, Google Maps location, Instagram and
              Facebook.
            </p>
          </div>
          <ContactQr />
        </div>
      </section>
    </div>
  );
}
