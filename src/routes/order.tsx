import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts } from "@/hooks/use-products";
import { company, whatsappLink } from "@/lib/company";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "How to Order | Al Saqiya Trading" },
      {
        name: "description",
        content:
          "Build your tile order and send it straight to Al Saqiya Trading on WhatsApp. No online payment — our team confirms stock, price and delivery.",
      },
      { property: "og:title", content: "How to Order | Al Saqiya Trading" },
      {
        property: "og:description",
        content: "Prepare your tile requirement and send it to our sales team on WhatsApp.",
      },
    ],
  }),
  component: OrderPage,
});

const steps = [
  {
    n: "01",
    title: "Choose your surfaces",
    body: "Browse the catalogue and note the product names, sizes and finishes you need.",
  },
  {
    n: "02",
    title: "Send the requirement",
    body: "Fill the form below — it opens WhatsApp with your order ready to send.",
  },
  {
    n: "03",
    title: "We confirm & deliver",
    body: "We reply with availability, final pricing and a delivery slot. Payment is arranged directly with our team.",
  },
];

function OrderPage() {
  const { products } = useProducts();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    product: "",
    quantity: "",
    location: "",
    notes: "",
  });

  const message = useMemo(
    () =>
      [
        "New order enquiry — Al Saqiya Trading",
        "",
        `Name: ${form.name || "-"}`,
        `Contact: ${form.phone || "-"}`,
        `Product: ${form.product || "-"}`,
        `Quantity (m²): ${form.quantity || "-"}`,
        `Delivery location: ${form.location || "-"}`,
        `Notes: ${form.notes || "-"}`,
      ].join("\n"),
    [form],
  );

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <p className="text-eyebrow text-muted-foreground">Ordering</p>
      <h1 className="rule-gold mt-3 text-4xl">Order over WhatsApp</h1>
      <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
        We handle every order personally — no card details, no checkout queue. Send your
        requirement and our Abu Dhabi sales team confirms stock, pricing and delivery.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="border border-border bg-card p-7 shadow-soft">
            <span className="font-display text-3xl text-gold">{s.n}</span>
            <h2 className="mt-3 text-xl">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="border border-border bg-card p-8 shadow-soft">
          <h2 className="text-2xl">Order details</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                placeholder="e.g. Ahmed Al Mansoori"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Contact number</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => set("phone")(e.target.value)}
                placeholder="+971 5x xxx xxxx"
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label>Product</Label>
              <Select value={form.product} onValueChange={set("product")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product from the catalogue" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={`${p.name} — ${p.size} ${p.finish}`}>
                      {p.name} — {p.size} {p.finish}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="qty">Quantity (m²)</Label>
              <Input
                id="qty"
                value={form.quantity}
                onChange={(e) => set("quantity")(e.target.value)}
                placeholder="e.g. 240"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="loc">Delivery location</Label>
              <Input
                id="loc"
                value={form.location}
                onChange={(e) => set("location")(e.target.value)}
                placeholder="e.g. Al Reem Island, Abu Dhabi"
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => set("notes")(e.target.value)}
                placeholder="Site timing, shade matching, trim requirements…"
                rows={4}
              />
            </div>
          </div>

          <Button asChild variant="brand" size="lg" className="mt-8 w-full sm:w-auto">
            <a href={whatsappLink(message)} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" />
              Send order on WhatsApp
            </a>
          </Button>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="surface-navy p-8">
            <h2 className="text-2xl">Message preview</h2>
            <pre className="mt-5 whitespace-pre-wrap break-words font-sans text-xs leading-relaxed opacity-85">
              {message}
            </pre>
          </div>
          <div className="border border-border bg-card p-8 shadow-soft">
            <h3 className="text-xl">Good to know</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>• Minimum order for site delivery is one full pallet per shade lot.</li>
              <li>• Samples can be collected from Mussafah or couriered on request.</li>
              <li>• Payment is arranged directly with our sales team, not online.</li>
              <li>
                • Not sure which tile? <Link to="/products" className="text-primary underline">Browse the catalogue</Link>{" "}
                or WhatsApp {company.whatsapp}.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
