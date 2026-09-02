import { useCallback, useEffect, useState } from "react";
import { listProducts, seedProducts, type Product } from "@/lib/products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(seedProducts);

  const sync = useCallback(() => setProducts(listProducts()), []);

  useEffect(() => {
    sync();
    const handler = () => sync();
    window.addEventListener("al-saqiya:products-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("al-saqiya:products-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, [sync]);

  return { products, refresh: sync };
}
