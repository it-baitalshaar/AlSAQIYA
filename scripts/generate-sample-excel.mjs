import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as XLSX from "xlsx";

const headers = [
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
];

const rows = [
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
    inStock: "yes",
    featured: "yes",
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
    inStock: "yes",
    featured: "yes",
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
    inStock: "yes",
    featured: "no",
    description: "Replace this row with a real product, then import.",
    image: "",
  },
];

const wb = XLSX.utils.book_new();
const catalogue = XLSX.utils.json_to_sheet(rows, { header: headers });
catalogue["!cols"] = headers.map((key) => ({
  wch: key === "description" || key === "image" || key === "application" ? 40 : 18,
}));
XLSX.utils.book_append_sheet(wb, catalogue, "Catalogue");
XLSX.utils.book_append_sheet(
  wb,
  XLSX.utils.aoa_to_sheet([
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
  ]),
  "Instructions",
);

const out = resolve(dirname(fileURLToPath(import.meta.url)), "../public/samples/al-saqiya-catalogue-template.xlsx");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
console.log("Wrote", out);
