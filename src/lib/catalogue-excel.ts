import * as XLSX from "xlsx";
import { categories, slugify, type Category, type Product } from "@/lib/products";

export const excelHeaders = [
  "id",
  "name",
  "collection",
  "category",
  "size",
  "finish",
  "thickness",
  "origin",
  "application",
  "price",
  "inStock",
  "featured",
  "description",
  "image",
] as const;

type ExcelRow = Record<(typeof excelHeaders)[number], string>;

function asCategory(value: string): Category {
  return (categories as readonly string[]).includes(value)
    ? (value as Category)
    : "Floor Tiles";
}

function asBool(value: unknown, fallback = false) {
  const v = String(value ?? "").trim().toLowerCase();
  if (["yes", "true", "1", "y"].includes(v)) return true;
  if (["no", "false", "0", "n"].includes(v)) return false;
  return fallback;
}

export function productToExcelRow(product: Product): ExcelRow {
  return {
    id: product.id,
    name: product.name,
    collection: product.collection,
    category: product.category,
    size: product.size,
    finish: product.finish,
    thickness: product.thickness,
    origin: product.origin,
    application: product.application,
    price: product.price,
    inStock: product.inStock ? "yes" : "no",
    featured: product.featured ? "yes" : "no",
    description: product.description,
    image: product.image.startsWith("data:") ? "" : product.image,
  };
}

export function excelRowToProduct(row: Record<string, unknown>): Product | null {
  const name = String(row["name"] ?? "").trim();
  if (!name) return null;
  const id = String(row["id"] ?? "").trim() || slugify(name);
  return {
    id,
    name,
    collection: String(row["collection"] ?? "").trim(),
    category: asCategory(String(row["category"] ?? "").trim()),
    size: String(row["size"] ?? "60×120 cm").trim() || "60×120 cm",
    finish: String(row["finish"] ?? "Matt").trim() || "Matt",
    thickness: String(row["thickness"] ?? "9 mm").trim() || "9 mm",
    origin: String(row["origin"] ?? "Imported").trim() || "Imported",
    application: String(row["application"] ?? "").trim(),
    price: String(row["price"] ?? "").trim(),
    inStock: asBool(row["inStock"], true),
    featured: asBool(row["featured"], false),
    description: String(row["description"] ?? "").trim(),
    image: String(row["image"] ?? "").trim(),
  };
}

function instructionSheet() {
  return XLSX.utils.aoa_to_sheet([
    ["Al Saqiya Trading — catalogue Excel"],
    [],
    ["How to use"],
    ["1. Keep the header row on the Catalogue sheet."],
    ["2. Add one product per row. Name is required."],
    ["3. category must be one of: Wall Tiles, Floor Tiles, Outdoor Porcelain, Wood Look, Sanitary Ware"],
    ["4. price example: AED 68 / m²"],
    ["5. inStock and featured: yes or no"],
    ["6. image: paste a photo URL, or leave blank and upload the photo in Admin after import"],
    ["7. Save this file, then use Import Excel on the Admin page"],
    [],
    ["Do not change column titles. Extra columns are ignored."],
  ]);
}

export function buildCatalogueWorkbook(products: Product[]) {
  const wb = XLSX.utils.book_new();
  const rows = products.map(productToExcelRow);
  const sheet = XLSX.utils.json_to_sheet(rows, { header: [...excelHeaders] });
  sheet["!cols"] = excelHeaders.map((key) => ({
    wch: key === "description" || key === "image" || key === "application" ? 40 : 18,
  }));
  XLSX.utils.book_append_sheet(wb, sheet, "Catalogue");
  XLSX.utils.book_append_sheet(wb, instructionSheet(), "Instructions");
  return wb;
}

export function downloadCatalogueExcel(products: Product[], filename: string) {
  const workbook = buildCatalogueWorkbook(products);
  const bytes = XLSX.write(workbook, { bookType: "xlsx", type: "array" }) as Uint8Array;
  const blob = new Blob([bytes], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function parseCatalogueExcel(buffer: ArrayBuffer): Product[] {
  const wb = XLSX.read(buffer, { type: "array" });
  const name = wb.SheetNames.includes("Catalogue") ? "Catalogue" : wb.SheetNames[0];
  if (!name) return [];
  const sheet = wb.Sheets[name];
  if (!sheet) return [];
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  return raw.map(excelRowToProduct).filter((p): p is Product => p !== null);
}

export const sampleExcelRows: Product[] = [
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
    description: "Soft grey-veined marble-look glossy wall tile.",
    image: "",
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
    description: "Classic travertine ivory with vertical vein-cut movement.",
    image: "",
  },
  {
    id: "",
    name: "Your new product",
    collection: "Collection name",
    category: "Floor Tiles",
    size: "60×120 cm",
    finish: "Matt",
    thickness: "9 mm",
    origin: "Imported",
    application: "",
    price: "AED 0 / m²",
    inStock: true,
    featured: false,
    description: "Replace this row with a real product, then import.",
    image: "",
  },
];
