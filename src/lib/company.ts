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
  addressEn: "Al Saqiya Trading, Musaffah Industrial Area Sector M38, Abu Dhabi",
  landmark: "Near Mohammed Asheer Ali Suleman Al Mazroui Mosque",
  addressAr: "مصفح الصناعية، قطاع م 38، أبوظبي",
  hours: "Saturday – Thursday · 8:00 – 18:00",
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
