import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { company, whatsappLink } from "@/lib/company";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Showroom | Al Saqiya Trading, Abu Dhabi" },
      {
        name: "description",
        content:
          "Visit or call Al Saqiya Trading in Mussafah Industrial, Abu Dhabi. WhatsApp +971 50 808 5541 for tile availability, pricing and delivery.",
      },
      { property: "og:title", content: "Contact Al Saqiya Trading" },
      {
        property: "og:description",
        content: "Mussafah Industrial, Abu Dhabi. WhatsApp, call or email our sales team.",
      },
    ],
  }),
  component: Contact,
});

const cards = [
  {
    icon: MessageCircle,
    label: "WhatsApp (sales & orders)",
    value: company.whatsapp,
    href: whatsappLink("Hello Al Saqiya Trading, I have an enquiry."),
  },
  { icon: Phone, label: "Telephone", value: company.phone, href: `tel:${company.phone}` },
  { icon: Mail, label: "Email", value: company.email, href: `mailto:${company.email}` },
  { icon: MapPin, label: "Address", value: company.addressEn },
  { icon: Clock, label: "Working hours", value: company.hours },
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
          <div className="overflow-hidden border border-border">
            <iframe
              title="Al Saqiya Trading location — Mussafah Industrial, Abu Dhabi"
              src="https://www.google.com/maps?q=Mussafah%20Industrial%20M38%20Abu%20Dhabi&output=embed"
              className="h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="surface-navy p-8">
            <h2 className="text-2xl">Fastest way to reach us</h2>
            <p className="mt-3 text-sm leading-relaxed opacity-85">
              Send your tile schedule, drawings or a photo of the reference finish on WhatsApp. Our
              sales team confirms availability, pricing and delivery timing the same working day.
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
    </div>
  );
}
