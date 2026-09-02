import { MessageCircle } from "lucide-react";
import { company, whatsappLink } from "@/lib/company";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink(
        "Hello Al Saqiya Trading, I found you on your website and would like to chat.",
      )}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat on WhatsApp ${company.whatsapp}`}
      className="group fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-3.5 text-primary-deep shadow-lift transition-transform hover:scale-[1.03]"
    >
      <MessageCircle className="size-5" />
      <span className="hidden text-xs font-semibold uppercase tracking-wider sm:inline">
        Chat with us
      </span>
    </a>
  );
}
