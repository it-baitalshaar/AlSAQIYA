import { Download, FileSpreadsheet, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  deleteAppwriteProduct,
  upsertAppwriteProduct,
} from "@/lib/appwrite";
import {
  downloadCatalogueExcel,
  parseCatalogueExcel,
  sampleExcelRows,
} from "@/lib/catalogue-excel";
import {
  mergeImportedProducts,
  productToAppwriteData,
  saveProducts,
  slugify,
  type Product,
} from "@/lib/products";

export function AdminExcel({
  products,
  onDone,
}: {
  products: Product[];
  onDone: () => void;
}) {
  const persist = async (next: Product[]) => {
    const failures: string[] = [];
    let lastError = "";
    for (const product of next) {
      try {
        await upsertAppwriteProduct(product.id, productToAppwriteData(product));
      } catch (error) {
        lastError = error instanceof Error ? error.message : "Appwrite save failed";
        failures.push(product.name);
      }
    }
    saveProducts(next);
    if (failures.length === next.length && lastError) {
      toast.error(lastError);
    } else if (failures.length) {
      toast.error(`Saved locally. Appwrite missed: ${failures.slice(0, 3).join(", ")}`);
    } else {
      toast.success("Catalogue saved to Appwrite.");
    }
    onDone();
  };

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const incoming = parseCatalogueExcel(await file.arrayBuffer()).map((p) => ({
        ...p,
        id: p.id || slugify(p.name),
      }));
      if (!incoming.length) {
        toast.error("No product rows found. Keep the header row and add a name on each line.");
        return;
      }
      await persist(mergeImportedProducts(products, incoming));
      toast.success(`Imported ${incoming.length} product${incoming.length === 1 ? "" : "s"}.`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not read that Excel file.",
      );
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="border border-border bg-card p-8 shadow-soft">
        <p className="text-eyebrow text-muted-foreground">Template</p>
        <h2 className="mt-3 text-2xl">Sample Excel file</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Download the sample, fill one product per row (name, size, finish, price, photo URL),
          save, then import it here. Leave <span className="font-medium text-foreground">image</span>{" "}
          blank if you will upload photos in the product form after import.
        </p>
        <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Download the sample Excel file</li>
          <li>Add or edit rows — do not rename the column headers</li>
          <li>Category must be Wall Tiles, Floor Tiles, Outdoor Porcelain, Wood Look or Sanitary Ware</li>
          <li>Price like <code>AED 68 / m²</code> · inStock/featured: yes or no</li>
          <li>Import the saved file to update the catalogue</li>
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            variant="brand"
            type="button"
            onClick={() => {
              try {
                downloadCatalogueExcel(sampleExcelRows, "Al-Saqiya-Catalogue-Sample.xlsx");
                toast.success("Sample Excel downloaded.");
              } catch {
                window.location.href = "/Al-Saqiya-Catalogue-Sample.xlsx";
              }
            }}
          >
            <Download className="size-4" />
            Download sample Excel
          </Button>
          <label className="inline-flex cursor-pointer">
            <span className="inline-flex h-8 items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-xs font-semibold uppercase tracking-wide shadow-sm hover:bg-accent">
              <Upload className="size-4" />
              Import Excel
            </span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => {
                void onImport(e.target.files?.[0]);
                e.currentTarget.value = "";
              }}
            />
          </label>
        </div>
      </div>

      <div className="border border-border bg-card p-8 shadow-soft">
        <p className="text-eyebrow text-muted-foreground">Export</p>
        <h2 className="mt-3 text-2xl">Current catalogue</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Export every product now on this site — names, sizes, finishes, prices and image URLs —
          into an Excel file you can edit and import again.
        </p>
        <p className="mt-4 text-sm">
          <span className="font-medium">{products.length}</span> product
          {products.length === 1 ? "" : "s"} in the catalogue
        </p>
        <Button
          variant="quiet"
          className="mt-8"
          onClick={() =>
            downloadCatalogueExcel(products, "Al-Saqiya-Catalogue-Export.xlsx")
          }
        >
          <FileSpreadsheet className="size-4" />
          Export Excel
        </Button>
      </div>
    </div>
  );
}

export async function pushCatalogueToAppwrite(products: Product[]) {
  for (const product of products) {
    await upsertAppwriteProduct(product.id, productToAppwriteData(product));
  }
}

export async function removeCatalogueProduct(id: string) {
  await deleteAppwriteProduct(id);
}
