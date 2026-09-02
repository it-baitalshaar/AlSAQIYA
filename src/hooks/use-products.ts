import { useCallback, useEffect, useState } from "react";
import { listAppwriteProducts } from "@/lib/appwrite";
import { listProducts, productFromAppwrite, seedProducts, type Product } from "@/lib/products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [source, setSource] = useState<"appwrite" | "local">("local");
  const [ready, setReady] = useState(false);

  const sync = useCallback(async () => {
    try {
      const rows = await listAppwriteProducts();
      setProducts(rows.map(productFromAppwrite));
      setSource("appwrite");
    } catch {
      setProducts(listProducts());
      setSource("local");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void sync();
    const handler = () => {
      void sync();
    };
    window.addEventListener("al-saqiya:products-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("al-saqiya:products-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, [sync]);

  return { products, refresh: sync, source, ready };
}
