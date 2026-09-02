import { catalogImages, localizeImageUrl } from "@/lib/catalog-images";
import type { AppwriteProductRow } from "@/lib/appwrite";

export type Product = {
  id: string;
  name: string;
  collection: string;
  category: Category;
  size: string;
  finish: string;
  thickness: string;
  origin: string;
  application: string;
  price: string;
  inStock: boolean;
  featured: boolean;
  description: string;
  image: string;
  gallery?: string[];
};

export const categories = [
  "Wall Tiles",
  "Floor Tiles",
  "Outdoor Porcelain",
  "Wood Look",
  "Sanitary Ware",
] as const;

export type Category = (typeof categories)[number];

export const seedProducts: Product[] = [
  {
    id: "harmony-bianco",
    name: "Harmony Bianco",
    collection: "Harmony",
    category: "Wall Tiles",
    size: "60×120 cm",
    finish: "Glossy",
    thickness: "9 mm",
    origin: "Imported",
    application: "Bathroom & living wall cladding",
    price: "AED 68 / m²",
    inStock: true,
    featured: true,
    description:
      "A soft grey-veined marble look with a mirror-clean glossy face. Harmony Bianco pairs a 60×120 glossy wall tile with a matching 60×60 matt floor for a seamless bathroom scheme.",
    image: catalogImages.tile1,
    gallery: [catalogImages.tile1, catalogImages.tile6],
  },
  {
    id: "made-in-ksa-satin",
    name: "Satin Grey 9.5 MM",
    collection: "KSA Satin",
    category: "Wall Tiles",
    size: "60×120 cm",
    finish: "Satin",
    thickness: "9.5 mm",
    origin: "Made in KSA",
    application: "Interior walls & feature panels",
    price: "AED 54 / m²",
    inStock: true,
    featured: true,
    description:
      "Gulf-manufactured satin porcelain with a whisper-soft light grey body. Consistent shade lots make it ideal for large residential and hospitality wall runs.",
    image: catalogImages.tile2,
    gallery: [catalogImages.tile2],
  },
  {
    id: "porcellan-uae-18mm",
    name: "Porcellan UAE 18 MM",
    collection: "Porcellan Outdoor",
    category: "Outdoor Porcelain",
    size: "60×120 cm",
    finish: "Matt",
    thickness: "18 mm",
    origin: "Made in UAE",
    application: "Terraces, walkways & pool decks",
    price: "AED 129 / m²",
    inStock: true,
    featured: true,
    description:
      "Heavy-gauge 18 mm outdoor porcelain in a dark stone tone. Frost and slip resistant, suitable for pedestal or sand-set installation on roof terraces and landscaped paths.",
    image: catalogImages.tile3,
    gallery: [catalogImages.tile3, catalogImages.tile8],
  },
  {
    id: "concreta-grey",
    name: "Concreta Grey",
    collection: "Concreta",
    category: "Floor Tiles",
    size: "60×120 cm",
    finish: "Matt",
    thickness: "9 mm",
    origin: "Imported",
    application: "Interior floors & commercial spaces",
    price: "AED 59 / m²",
    inStock: true,
    featured: false,
    description:
      "A warm cement-effect porcelain with subtle tonal movement — the neutral base for minimalist interiors, showrooms and offices.",
    image: catalogImages.tile4,
  },
  {
    id: "casaluna-marfil-sm",
    name: "Casaluna Marfil SM",
    collection: "Casaluna",
    category: "Floor Tiles",
    size: "60×120 cm",
    finish: "Semi-matt",
    thickness: "9 mm",
    origin: "Imported",
    application: "Living areas, lobbies & majlis",
    price: "AED 74 / m²",
    inStock: true,
    featured: true,
    description:
      "Classic travertine ivory with vertical vein-cut movement. A timeless warm neutral that lifts majlis, lobby and villa flooring.",
    image: catalogImages.tile5,
  },
  {
    id: "kenzo-white",
    name: "Kenzo White",
    collection: "Kenzo",
    category: "Wall Tiles",
    size: "60×120 cm",
    finish: "Matt",
    thickness: "9 mm",
    origin: "Imported",
    application: "Walls & full-height cladding",
    price: "AED 49 / m²",
    inStock: true,
    featured: false,
    description:
      "A pure, near-plain white with the faintest cloud texture. Kenzo White is the go-to backdrop tile for bright bathrooms and kitchens.",
    image: catalogImages.tile6,
  },
  {
    id: "sd612-oak",
    name: "Natural Oak SD612",
    collection: "Wood Series",
    category: "Wood Look",
    size: "60×120 cm",
    finish: "Matt wood grain",
    thickness: "9 mm",
    origin: "Imported",
    application: "Bedrooms, retail & warm interiors",
    price: "AED 62 / m²",
    inStock: true,
    featured: true,
    description:
      "Large-format wood-look porcelain with a bleached oak grain. All the warmth of timber with the durability and zero maintenance of porcelain.",
    image: catalogImages.tile7,
  },
  {
    id: "porcellan-auh-20mm",
    name: "Porcellan AUH 20 MM R9",
    collection: "Porcellan Outdoor",
    category: "Outdoor Porcelain",
    size: "60×120 cm",
    finish: "R9 Matt",
    thickness: "20 mm",
    origin: "Made in UAE",
    application: "Driveways, gardens & courtyards",
    price: "AED 139 / m²",
    inStock: true,
    featured: false,
    description:
      "Structural 20 mm slabs with an R9 anti-slip finish — engineered for gravel-set garden grids, courtyards and high-traffic exterior paving.",
    image: catalogImages.tile8,
  },
];

/* ------------------------------------------------------------------ *
 * Local catalog store.
 * Mirrors the shape of an Appwrite Databases collection so the admin
 * screen can be pointed at Appwrite later without UI changes.
 * ------------------------------------------------------------------ */

const STORAGE_KEY = "al-saqiya:products:v1";

function isBrowser() {
  return typeof window !== "undefined";
}

export function listProducts(): Product[] {
  if (!isBrowser()) return seedProducts;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedProducts;
    const parsed = (JSON.parse(raw) as Product[]).map((product) => ({
      ...product,
      image: localizeImageUrl(product.image),
      gallery: product.gallery?.map(localizeImageUrl),
    }));
    return Array.isArray(parsed) && parsed.length ? parsed : seedProducts;
  } catch {
    return seedProducts;
  }
}

export function saveProducts(products: Product[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event("al-saqiya:products-changed"));
}

export function resetProducts() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("al-saqiya:products-changed"));
}

export function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `product-${Date.now()}`
  );
}

export function emptyProduct(): Product {
  return {
    id: "",
    name: "",
    collection: "",
    category: "Floor Tiles",
    size: "60×120 cm",
    finish: "Matt",
    thickness: "9 mm",
    origin: "Imported",
    application: "",
    price: "",
    inStock: true,
    featured: false,
    description: "",
    image: "",
  };
}

export function productToAppwriteData(product: Product) {
  return {
    name: product.name,
    collection: product.collection,
    category: product.category,
    size: product.size,
    finish: product.finish,
    thickness: product.thickness,
    origin: product.origin,
    application: product.application,
    price: product.price,
    inStock: product.inStock,
    featured: product.featured,
    description: product.description,
    image: product.image.startsWith("data:") ? "" : product.image,
    gallery: (product.gallery ?? []).filter((url) => !url.startsWith("data:")),
  };
}

export function productFromAppwrite(row: AppwriteProductRow): Product {
  return {
    id: row.$id,
    name: row.name,
    collection: row.collection ?? "",
    category: (categories as readonly string[]).includes(row.category)
      ? (row.category as Category)
      : "Floor Tiles",
    size: row.size ?? "",
    finish: row.finish ?? "",
    thickness: row.thickness ?? "",
    origin: row.origin ?? "",
    application: row.application ?? "",
    price: row.price ?? "",
    inStock: row.inStock ?? true,
    featured: row.featured ?? false,
    description: row.description ?? "",
    image: localizeImageUrl(row.image ?? ""),
    gallery: row.gallery?.map(localizeImageUrl),
  };
}

export function mergeImportedProducts(current: Product[], incoming: Product[]) {
  const byId = new Map(current.map((p) => [p.id, p]));
  for (const item of incoming) {
    const existing = byId.get(item.id);
    byId.set(item.id, {
      ...item,
      image: item.image || existing?.image || "",
      gallery: item.gallery?.length ? item.gallery : existing?.gallery,
    });
  }
  return [...byId.values()];
}
