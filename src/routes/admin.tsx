import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Plus, RotateCcw, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProducts } from "@/hooks/use-products";
import {
  categories,
  emptyProduct,
  resetProducts,
  saveProducts,
  slugify,
  type Category,
  type Product,
} from "@/lib/products";
import { appwriteConfig } from "@/lib/appwrite";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Catalogue Admin | Al Saqiya Trading" },
      {
        name: "description",
        content:
          "Internal catalogue manager for Al Saqiya Trading: add, edit and manage tile products, images and stock status.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Catalogue Admin | Al Saqiya Trading" },
      { property: "og:description", content: "Internal catalogue manager for Al Saqiya Trading." },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { products } = useProducts();
  const [draft, setDraft] = useState<Product>(emptyProduct());
  const [editingId, setEditingId] = useState<string | null>(null);

  const set = <K extends keyof Product>(k: K, v: Product[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const startNew = () => {
    setDraft(emptyProduct());
    setEditingId(null);
  };

  const startEdit = (p: Product) => {
    setDraft({ ...p });
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("image", String(reader.result));
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!draft.name.trim()) {
      toast.error("Product name is required.");
      return;
    }
    const id = editingId ?? slugify(draft.name);
    const next: Product = { ...draft, id };
    const list = editingId
      ? products.map((p) => (p.id === editingId ? next : p))
      : [next, ...products.filter((p) => p.id !== id)];
    saveProducts(list);
    toast.success(editingId ? "Product updated." : "Product added to the catalogue.");
    startNew();
  };

  const remove = (id: string) => {
    saveProducts(products.filter((p) => p.id !== id));
    if (editingId === id) startNew();
    toast.success("Product removed.");
  };

  const toggleStock = (id: string) => {
    saveProducts(products.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p)));
  };

  const toggleFeatured = (id: string) => {
    saveProducts(products.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)));
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-eyebrow text-muted-foreground">Internal tool</p>
          <h1 className="rule-gold mt-3 text-4xl">Catalogue admin</h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Products are stored in this browser for now. The data shape mirrors the{" "}
            <code className="text-xs">{appwriteConfig.productsCollectionId}</code> collection, so
            switching to the Appwrite backend later needs no UI changes.
          </p>
        </div>
        <Button
          variant="quiet"
          onClick={() => {
            resetProducts();
            startNew();
            toast.success("Catalogue reset to the original showroom list.");
          }}
        >
          <RotateCcw className="size-4" />
          Reset to defaults
        </Button>
      </div>

      <Tabs defaultValue="products" className="mt-10">
        <TabsList>
          <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
          <TabsTrigger value="stock">Stock & featured</TabsTrigger>
          <TabsTrigger value="backend">Backend</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div className="border border-border bg-card p-8 shadow-soft">
              <h2 className="text-2xl">{editingId ? "Edit product" : "Add product"}</h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Name">
                  <Input value={draft.name} onChange={(e) => set("name", e.target.value)} />
                </Field>
                <Field label="Collection">
                  <Input
                    value={draft.collection}
                    onChange={(e) => set("collection", e.target.value)}
                  />
                </Field>
                <Field label="Category">
                  <Select
                    value={draft.category}
                    onValueChange={(v) => set("category", v as Category)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Size">
                  <Input value={draft.size} onChange={(e) => set("size", e.target.value)} />
                </Field>
                <Field label="Finish">
                  <Input value={draft.finish} onChange={(e) => set("finish", e.target.value)} />
                </Field>
                <Field label="Thickness">
                  <Input
                    value={draft.thickness}
                    onChange={(e) => set("thickness", e.target.value)}
                  />
                </Field>
                <Field label="Origin">
                  <Input value={draft.origin} onChange={(e) => set("origin", e.target.value)} />
                </Field>
                <Field label="Price">
                  <Input
                    value={draft.price}
                    onChange={(e) => set("price", e.target.value)}
                    placeholder="AED 68 / m²"
                  />
                </Field>
                <Field label="Application" className="sm:col-span-2">
                  <Input
                    value={draft.application}
                    onChange={(e) => set("application", e.target.value)}
                    placeholder="Bathroom & living wall cladding"
                  />
                </Field>
                <Field label="Description" className="sm:col-span-2">
                  <Textarea
                    rows={4}
                    value={draft.description}
                    onChange={(e) => set("description", e.target.value)}
                  />
                </Field>

                <Field label="Image" className="sm:col-span-2">
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="inline-flex cursor-pointer items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-widest hover:border-primary/40">
                      <Upload className="size-4" />
                      Upload photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onFile(e.target.files?.[0])}
                      />
                    </label>
                    {draft.image ? (
                      <img
                        src={draft.image}
                        alt=""
                        className="size-20 border border-border object-cover"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">No image selected</span>
                    )}
                  </div>
                  <Input
                    value={draft.image.startsWith("data:") ? "" : draft.image}
                    onChange={(e) => set("image", e.target.value)}
                    placeholder="…or paste an image URL"
                    className="mt-3"
                  />
                </Field>

                <div className="flex items-center gap-3">
                  <Switch
                    checked={draft.inStock}
                    onCheckedChange={(v) => set("inStock", v)}
                    id="inStock"
                  />
                  <Label htmlFor="inStock">In stock</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={draft.featured}
                    onCheckedChange={(v) => set("featured", v)}
                    id="featured"
                  />
                  <Label htmlFor="featured">Featured on home</Label>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Button variant="brand" onClick={submit}>
                  <Plus className="size-4" />
                  {editingId ? "Save changes" : "Add product"}
                </Button>
                {editingId && (
                  <Button variant="quiet" onClick={startNew}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            <div className="border border-border bg-card shadow-soft">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {p.image && (
                            <img src={p.image} alt="" className="size-10 object-cover" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {p.size} · {p.finish}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{p.category}</TableCell>
                      <TableCell className="text-xs">{p.price || "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => startEdit(p)}>
                            <Pencil className="size-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => remove(p.id)}>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stock" className="mt-8">
          <div className="border border-border bg-card shadow-soft">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>In stock</TableHead>
                  <TableHead>Featured</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-sm">{p.name}</TableCell>
                    <TableCell>
                      <Switch checked={p.inStock} onCheckedChange={() => toggleStock(p.id)} />
                    </TableCell>
                    <TableCell>
                      <Switch checked={p.featured} onCheckedChange={() => toggleFeatured(p.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="backend" className="mt-8">
          <div className="max-w-2xl border border-border bg-card p-8 shadow-soft">
            <h2 className="text-2xl">Appwrite configuration</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              These are placeholder values. Replace them with your real Appwrite project settings
              when you are ready to move the catalogue off this browser.
            </p>
            <dl className="mt-6 divide-y divide-border">
              {Object.entries(appwriteConfig).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-3 text-sm">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-mono text-xs">{String(v)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`grid gap-2 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
