import companyLogoSrc from "@/assets/al-saqiya-logo.png";

export const companyLogo = companyLogoSrc;

export const company = {
  nameEn: "AL SAQIYA TRADING",
  nameAr: "الساقية التجارية",
  legalName: "AL SAQIYA TRADING - SOLE PROPRIETORSHIP L.L.C.",
  tagline: "Tiles, Porcelain & Sanitary Ware — Abu Dhabi since 1991",
  licenceNo: "CN-1021313",
  establishedYear: "1991",
  website: "https://alsaqiya.ae",
  websiteLabel: "alsaqiya.ae",
  email: "accountant@alsaqiauae.ae",
  phone: "+971 50 444 3247",
  landline: "+971 2 551 5665",
  whatsapp: "+971 50 444 3247",
  addressEn: "Musaffah - Musaffah Industrial - M38, Abu Dhabi",
  landmark: "Near Mohammed Asheer Ali Suleman Al Mazroui Mosque",
  addressAr: "مصفح - مصفح الصناعية - م38، أبوظبي",
  instagram: "https://www.instagram.com/alsaqia/",
  instagramHandle: "@alsaqia",
  facebook: "https://www.facebook.com/p/Al-Saqia-Trading-Est-Mussafah-M38-100070240700896/",
  facebookHandle: "Al Saqia Trading Est",
  mapsLat: 24.35766,
  mapsLng: 54.496312,
  mapsUrl:
    "https://www.google.com/maps/place/Al+Saqiya+Trading/@24.35766,54.496312,19z/data=!4m6!3m5!1s0x3e5e40e9346a3a21:0xf02ec1540d01cabd!8m2!3d24.35766!4d54.496312",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227.16734029202135!2d54.496312!3d24.35766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e40e9346a3a21%3A0xf02ec1540d01cabd!2zQWwgU2FxaXlhIFRyYWRpbmcg2KfZhNiz2KfZgtmK2Kkg2KfZhNiq2KzYp9ix2YrYqQ!5e0!3m2!1sen!2sae!4v1788692073719!5m2!1sen!2sae",
  branchLabel: "Branch",
  branchAddressEn: "306 Al Mantaqah As Sina'iyah 1 St, Musaffah Industrial - M38, Abu Dhabi",
  branchMapsUrl:
    "https://www.google.com/maps/place/Al+Saqiya+Trading+306+Al+Mantaqah+As+Sina'iyah+1+St/@24.354857,54.494925,19z/data=!4m6!3m5!1s0x3e5e41006cc4c70d:0x8cd4264d28bd2d7b!8m2!3d24.354857!4d54.494925",
  branchMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227.1724986440718!2d54.494925!3d24.354857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e41006cc4c70d%3A0x8cd4264d28bd2d7b!2zQWwgU2FxaXlhIFRyYWRpbmcg2KfZhNiz2KfZgtmK2Kkg2KfZhNiq2KzYp9ix2YrYqQ!5e0!3m2!1sen!2sae!4v1788689052183!5m2!1sen!2sae",
  hours: "Saturday – Thursday · 07:00 – 19:00",
  hoursClosed: "Friday closed",
  activities: [
    "Retail Sale of Tiles and Grounds",
    "Retail Sale of Sanitary Ware and Fittings",
    "Importing",
  ],
} as const;

export const whatsappNumber = company.whatsapp.replace(/[^\d]/g, "");

export function telHref(number: string) {
  return `tel:${number.replace(/[^\d+]/g, "")}`;
}

export function whatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function companyCardPath() {
  return "/card";
}

export function companyShareUrl() {
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${companyCardPath()}`;
  }
  return `${company.website}${companyCardPath()}`;
}

export function companyVCard() {
  const cell = company.phone.replace(/[^\d+]/g, "");
  const work = company.landline.replace(/[^\d+]/g, "");
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${company.nameEn}`,
    `N:;${company.nameEn};;;`,
    `ORG:${company.legalName}`,
    `TEL;TYPE=CELL,VOICE:${cell}`,
    `TEL;TYPE=WORK,VOICE:${work}`,
    `EMAIL;TYPE=INTERNET,WORK:${company.email}`,
    `URL:${company.website}`,
    `ADR;TYPE=WORK:;;${company.addressEn};;Abu Dhabi;;United Arab Emirates`,
    `item1.URL:${company.mapsUrl}`,
    "item1.X-ABLabel:Main showroom",
    `item2.URL:${company.branchMapsUrl}`,
    "item2.X-ABLabel:Branch",
    `item3.URL:${company.instagram}`,
    "item3.X-ABLabel:Instagram",
    `item4.URL:${company.facebook}`,
    "item4.X-ABLabel:Facebook",
    "END:VCARD",
  ].join("\r\n");
}

export function downloadVCard() {
  const blob = new Blob([companyVCard()], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Al-Saqiya-Trading.vcf";
  link.click();
  URL.revokeObjectURL(url);
}
