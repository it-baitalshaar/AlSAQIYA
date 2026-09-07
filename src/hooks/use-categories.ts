import { useCallback, useEffect, useState } from "react";
import {
  createAppwriteCategory,
  deleteAppwriteCategory,
  listAppwriteCategories,
} from "@/lib/appwrite";
import {
  defaultCategories,
  listLocalCategories,
  saveLocalCategories,
  setAllowedProductCategories,
  slugify,
  uniqueNames,
} from "@/lib/products";

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([...defaultCategories]);
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState<"appwrite" | "local">("local");

  const sync = useCallback(async () => {
    try {
      const rows = await listAppwriteCategories();
      const names = uniqueNames(rows.map((row) => row.name));
      const next = names.length ? names : [...defaultCategories];
      setCategories(next);
      setAllowedProductCategories(next);
      saveLocalCategories(next);
      setSource("appwrite");
    } catch {
      const next = listLocalCategories();
      setCategories(next);
      setAllowedProductCategories(next);
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
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("storage", handler);
    };
  }, [sync]);

  const addCategory = useCallback(
    async (rawName: string) => {
      const name = rawName.trim();
      if (!name) throw new Error("Category name is required.");
      if (categories.some((item) => item.toLowerCase() === name.toLowerCase())) {
        throw new Error("That category is already in the list.");
      }
      const id = slugify(name);
      const next = uniqueNames([...categories, name]);
      try {
        await createAppwriteCategory(id, name, Date.now());
        saveLocalCategories(next);
        setCategories(next);
        setAllowedProductCategories(next);
        setSource("appwrite");
      } catch (error) {
        saveLocalCategories(next);
        setCategories(next);
        setAllowedProductCategories(next);
        throw error;
      }
      return name;
    },
    [categories],
  );

  const removeCategory = useCallback(
    async (name: string) => {
      const next = categories.filter((item) => item !== name);
      try {
        await deleteAppwriteCategory(slugify(name));
        saveLocalCategories(next);
        setCategories(next);
        setAllowedProductCategories(next);
      } catch (error) {
        saveLocalCategories(next);
        setCategories(next);
        setAllowedProductCategories(next);
        throw error;
      }
    },
    [categories],
  );

  return { categories, refresh: sync, addCategory, removeCategory, ready, source };
}
