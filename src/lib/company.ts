import companyLogoSrc from "@/assets/al-saqiya-logo.png";

export const companyLogo = companyLogoSrc;

export const company = {
  nameEn: "AL SAQIYA TRADING",
  nameAr: "الساقية التجارية",
  legalName: "AL SAQIYA TRADING - SOLE PROPRIETORSHIP L.L.C.",
  tagline: "Tiles, Porcelain & Sanitary Ware — Abu Dhabi since 1991",
  licenceNo: "CN-1021313",
  establishedYear: "1991",
  email: "gm@alsaqiauae.ae",
  phone: "+971506117274",
  whatsapp: "+971508085541",
  addressEn: "Mussafah Industrial, M 38 - Plot 20, Abu Dhabi, UAE",
  addressAr: "مصفح الصناعية، م 38 - ق 20، أبوظبي",
  hours: "Saturday – Thursday · 8:00 – 18:00",
  activities: [
    "Retail Sale of Tiles and Grounds",
    "Retail Sale of Sanitary Ware and Fittings",
    "Importing",
  ],
} as const;

export const whatsappNumber = company.whatsapp.replace(/[^\d]/g, "");

export function whatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
