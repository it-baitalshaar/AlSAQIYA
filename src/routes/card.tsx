import { createFileRoute } from "@tanstack/react-router";
import { Clock, Facebook, Globe, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactQr } from "@/components/contact-qr";
import { Button } from "@/components/ui/button";
import { company, companyLogo, telHref, whatsappLink } from "@/lib/company";

export const Route = createFileRoute("/card")({
  head: () => ({
    meta: [
      { title: "Al Saqiya Trading | Contact card" },
      {
        name: "description",
        content:
          "Save Al Saqiya Trading contact details — mobile, landline, email, showroom map, Instagram and Facebook.",
      },
      { property: "og:title", content: "Al Saqiya Trading contact card" },
    ],
  }),
  component: ContactCard,
});

const details = [
  { icon: Phone, label: "Mobile / WhatsApp", value: company.phone, href: telHref(company.phone) },
  { icon: Phone, label: "Landline", value: company.landline, href: telHref(company.landline) },
  { icon: Mail, label: "Email", value: company.email, href: `mailto:${company.email}` },
  { icon: Globe, label: "Website", value: company.websiteLabel, href: company.website },
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
  {
    icon: Clock,
    label: "Main showroom hours",
    value: `${company.hours}. ${company.hoursClosed}.`,
  },
  {
    icon: Clock,
    label: "Branch hours",
    value: `${company.branchHours}. ${company.branchHoursClosed}.`,
  },
  { icon: Instagram, label: "Instagram", value: company.instagramHandle, href: company.instagram },
  { icon: Facebook, label: "Facebook", value: company.facebookHandle, href: company.facebook },
];

function ContactCard() {
  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <div className="border border-border bg-card p-8 shadow-soft">
        <div className="flex items-center gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-soft">
            <img src={companyLogo} alt="Al Saqiya Trading logo" className="h-full w-full object-contain" />
          </span>
          <div>
            <h1 className="font-display text-2xl leading-tight">{company.nameEn}</h1>
            <p className="mt-1 text-sm text-gold">{company.nameAr}</p>
          </div>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{company.tagline}</p>

        <ul className="mt-8 divide-y divide-border">
          {details.map((item) => {
            const row = (
              <>
                <item.icon className="mt-0.5 size-4 shrink-0 text-gold" />
                <span>
                  <span className="text-eyebrow block text-[0.6rem] text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-sm leading-relaxed">{item.value}</span>
                </span>
              </>
            );
            return (
              <li key={item.label}>
                {"href" in item && item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="flex gap-3 py-3.5 transition-colors hover:text-primary"
                  >
                    {row}
                  </a>
                ) : (
                  <div className="flex gap-3 py-3.5">{row}</div>
                )}
              </li>
            );
          })}
        </ul>

        <Button asChild variant="gold" className="mt-6 w-full">
          <a
            href={whatsappLink("Hello Al Saqiya Trading, I have an enquiry about tiles.")}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="size-4" />
            WhatsApp {company.whatsapp}
          </a>
        </Button>
      </div>

      <div className="mt-8 border border-border bg-card p-8 shadow-soft">
        <h2 className="text-xl">Share this card</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Download the QR and print it on catalogues, invoices or the showroom. The same code always
          opens this page with the latest details.
        </p>
        <div className="mt-6">
          <ContactQr compact />
        </div>
      </div>
    </div>
  );
}
