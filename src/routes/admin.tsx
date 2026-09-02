import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { LogOut, Pencil, Plus, RotateCcw, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { getAdminUser, loginAdmin, logoutAdmin } from "@/lib/admin-auth";
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
import { AdminExcel, pushCatalogueToAppwrite, removeCatalogueProduct } from "@/components/admin-excel";
import { useProducts } from "@/hooks/use-products";
import {
  categories,
  emptyProduct,
  productToAppwriteData,
  resetProducts,
  saveProducts,
  slugify,
  type Category,
  type Product,
} from "@/lib/products";
import { appwriteConfig, upsertAppwriteProduct, uploadProductImage } from "@/lib/appwrite";

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
  beforeLoad: async () => {
    const adminUser = await getAdminUser();
    return { adminUser };
  },
  component: AdminGate,
});

function AdminGate() {
  const { adminUser } = Route.useRouteContext();
  if (!adminUser) return <AdminLogin />;
  return <Admin user={adminUser} />;
}

function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await loginAdmin({ data: { username, password } });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      await router.invalidate();
    } catch {
      setError("Could not sign in. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-20">
      <p className="text-eyebrow text-muted-foreground">Staff only</p>
      <h1 className="rule-gold mt-3 text-4xl">Admin login</h1>
      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
        Sign in to manage the Al Saqiya catalogue.
      </p>
      <form onSubmit={(event) => void onSubmit(event)} className="mt-10 grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="admin-email">Email</Label>
          <Input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="admin-password">Password</Label>
          <Input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" variant="brand" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}

function Admin({ user }: { user: string }) {
  const router = useRouter();
  const { products, refresh, source } = useProducts();
  const [draft, setDraft] = useState<Product>(emptyProduct());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      set("image", url);
      toast.success("Photo uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Photo upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!draft.name.trim()) {
      toast.error("Product name is required.");
      return;
    }
    const id = editingId ?? slugify(draft.name);
    const next: Product = { ...draft, id };
    const list = editingId
      ? products.map((p) => (p.id === editingId ? next : p))
      : [next, ...products.filter((p) => p.id !== id)];
    try {
      await upsertAppwriteProduct(id, productToAppwriteData(next));
      saveProducts(list);
      toast.success(editingId ? "Product updated in Appwrite." : "Product added to Appwrite.");
    } catch (error) {
      saveProducts(list);
      toast.error(
        error instanceof Error
          ? error.message
          : "Saved in this browser. Appwrite did not accept the product yet.",
      );
    }
    await refresh();
    startNew();
  };

  const remove = async (id: string) => {
    const list = products.filter((p) => p.id !== id);
    try {
      await removeCatalogueProduct(id);
      saveProducts(list);
      toast.success("Product removed from Appwrite.");
    } catch (error) {
      saveProducts(list);
      toast.error(
        error instanceof Error ? error.message : "Removed in this browser. Appwrite delete failed.",
      );
    }
    if (editingId === id) startNew();
    await refresh();
  };

  const toggleStock = async (id: string) => {
    const next = products.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p));
    const updated = next.find((p) => p.id === id);
    if (!updated) return;
    try {
      await upsertAppwriteProduct(id, productToAppwriteData(updated));
      saveProducts(next);
    } catch (error) {
      saveProducts(next);
      toast.error(error instanceof Error ? error.message : "Stock updated only in this browser.");
    }
    await refresh();
  };

  const toggleFeatured = async (id: string) => {
    const next = products.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p));
    const updated = next.find((p) => p.id === id);
    if (!updated) return;
    try {
      await upsertAppwriteProduct(id, productToAppwriteData(updated));
      saveProducts(next);
    } catch (error) {
      saveProducts(next);
      toast.error(
        error instanceof Error ? error.message : "Featured flag updated only in this browser.",
      );
    }
    await refresh();
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-eyebrow text-muted-foreground">Internal tool · {user}</p>
          <h1 className="rule-gold mt-3 text-4xl">Catalogue admin</h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Add products with photos and prices here, or import them from Excel. Catalogue data is
            stored in Appwrite (
            {source === "appwrite"
              ? "connected — this list is live from Appwrite"
              : "not reachable, showing this browser’s copy only"}
            ).
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="quiet"
            onClick={async () => {
              await logoutAdmin();
              await router.invalidate();
            }}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
          <Button
            variant="quiet"
            onClick={async () => {
              try {
                await pushCatalogueToAppwrite(products);
                toast.success("This catalogue is now in Appwrite.");
                await refresh();
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Could not sync to Appwrite.");
              }
            }}
          >
            Sync to Appwrite
          </Button>
          <Button
            variant="quiet"
            onClick={() => {
              resetProducts();
              startNew();
              toast.success("Browser catalogue reset to the original showroom list.");
              void refresh();
            }}
          >
            <RotateCcw className="size-4" />
            Reset local defaults
          </Button>
        </div>
      </div>

      <Tabs defaultValue="products" className="mt-10">
        <TabsList>
          <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
          <TabsTrigger value="excel">Excel</TabsTrigger>
          <TabsTrigger value="stock">Stock & featured</TabsTrigger>
          <TabsTrigger value="backend">Appwrite</TabsTrigger>
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
                      {uploading ? "…" : ""}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => void onFile(e.target.files?.[0])}
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

        <TabsContent value="excel" className="mt-8">
          <AdminExcel products={products} onDone={() => void refresh()} />
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
            <h2 className="text-2xl">Appwrite</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Live project <span className="font-medium text-foreground">Al Saqia Trading</span> in
              Frankfurt. Products table and the image bucket are ready. Guest write is enabled for
              this internal admin — add Appwrite Auth before the site is public.
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
