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
  addressEn: "Musaffah - Musaffah Industrial - Abu Dhabi",
  landmark: "Near Mohammed Asheer Ali Suleman Al Mazroui Mosque",
  addressAr: "مصفح الصناعية، أبوظبي",
  mapsUrl: "https://maps.app.goo.gl/wEScgfHK1gHfZcqCA",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3634.6795657796833!2d54.4962817!3d24.357652299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e40e9346a3a21%3A0xf02ec1540d01cabd!2zQWwgU2FxaXlhIFRyYWRpbmcg2KfZhNiz2KfZgtmK2Kkg2KfZhNiq2KzYp9ix2YrYqQ!5e0!3m2!1sen!2sae!4v1788342862983!5m2!1sen!2sae",
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
