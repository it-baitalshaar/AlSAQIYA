/**
 * Appwrite catalogue API.
 * Browser calls go through TanStack server functions so Vercel / alsaqiya.ae
 * are not blocked by Appwrite CORS (the "Failed to fetch" error).
 */
import { createServerFn } from "@tanstack/react-start";

export const appwriteConfig = {
  endpoint:
    import.meta.env["VITE_APPWRITE_ENDPOINT"] ?? "https://fra.cloud.appwrite.io/v1",
  projectId: import.meta.env["VITE_APPWRITE_PROJECT_ID"] ?? "6a97c57e00324227cddc",
  databaseId: import.meta.env["VITE_APPWRITE_DATABASE_ID"] ?? "catalogue",
  productsCollectionId:
    import.meta.env["VITE_APPWRITE_PRODUCTS_COLLECTION_ID"] ?? "products",
  storageBucketId: import.meta.env["VITE_APPWRITE_BUCKET_ID"] ?? "product-images",
} as const;

const { endpoint, projectId, databaseId, productsCollectionId, storageBucketId } =
  appwriteConfig;

export type AppwriteProductRow = {
  $id: string;
  name: string;
  collection?: string;
  category: string;
  size?: string;
  finish?: string;
  thickness?: string;
  origin?: string;
  application?: string;
  price?: string;
  inStock?: boolean;
  featured?: boolean;
  description?: string;
  image?: string;
  gallery?: string[];
};

export function fileViewUrl(fileId: string) {
  return `${endpoint}/storage/buckets/${storageBucketId}/files/${fileId}/view?project=${projectId}`;
}

async function appwriteHeaders(extra?: HeadersInit) {
  const headers = new Headers({
    "X-Appwrite-Project": projectId,
    ...extra,
  });
  const apiKey = process.env["APPWRITE_API_KEY"];
  if (apiKey) headers.set("X-Appwrite-Key", apiKey);
  return headers;
}

async function parseBody(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
}

async function appwriteFetch(path: string, init: RequestInit = {}) {
  const extra = init.headers;
  const headers = await appwriteHeaders(extra);
  return fetch(`${endpoint}${path}`, { ...init, headers });
}

function rowsFrom(body: Record<string, unknown>) {
  const list = (body.rows ?? body.documents ?? []) as AppwriteProductRow[];
  return Array.isArray(list) ? list : [];
}

const listProductsFn = createServerFn({ method: "GET" }).handler(async () => {
  const tableUrl = `/tablesdb/databases/${databaseId}/tables/${productsCollectionId}/rows?queries[]=${encodeURIComponent("limit(500)")}`;
  const tableRes = await appwriteFetch(tableUrl);
  const tableBody = await parseBody(tableRes);
  if (tableRes.ok) return rowsFrom(tableBody);

  const docsUrl = `/databases/${databaseId}/collections/${productsCollectionId}/documents?queries[]=${encodeURIComponent("limit(500)")}`;
  const docsRes = await appwriteFetch(docsUrl);
  const docsBody = await parseBody(docsRes);
  if (!docsRes.ok) {
    throw new Error(docsBody.message ?? tableBody.message ?? `Appwrite list failed (${docsRes.status})`);
  }
  return rowsFrom(docsBody);
});

const upsertProductFn = createServerFn({ method: "POST" })
  .validator((input: { id: string; data: Record<string, unknown> }) => input)
  .handler(async ({ data: { id, data } }) => {
    const createTable = await appwriteFetch(
      `/tablesdb/databases/${databaseId}/tables/${productsCollectionId}/rows`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowId: id, data }),
      },
    );
    if (createTable.ok) return parseBody(createTable);

    const patchTable = await appwriteFetch(
      `/tablesdb/databases/${databaseId}/tables/${productsCollectionId}/rows/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      },
    );
    if (patchTable.ok) return parseBody(patchTable);

    const createDoc = await appwriteFetch(
      `/databases/${databaseId}/collections/${productsCollectionId}/documents`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: id, data }),
      },
    );
    if (createDoc.ok) return parseBody(createDoc);

    const patchDoc = await appwriteFetch(
      `/databases/${databaseId}/collections/${productsCollectionId}/documents/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      },
    );
    const body = await parseBody(patchDoc);
    if (!patchDoc.ok) {
      throw new Error(body.message ?? `Appwrite save failed (${patchDoc.status})`);
    }
    return body;
  });

const deleteProductFn = createServerFn({ method: "POST" })
  .validator((input: { id: string }) => input)
  .handler(async ({ data: { id } }) => {
    const tableRes = await appwriteFetch(
      `/tablesdb/databases/${databaseId}/tables/${productsCollectionId}/rows/${id}`,
      { method: "DELETE" },
    );
    if (tableRes.ok || tableRes.status === 404) return { ok: true };

    const docRes = await appwriteFetch(
      `/databases/${databaseId}/collections/${productsCollectionId}/documents/${id}`,
      { method: "DELETE" },
    );
    if (!docRes.ok && docRes.status !== 404) {
      const body = await parseBody(docRes);
      throw new Error(body.message ?? `Appwrite delete failed (${docRes.status})`);
    }
    return { ok: true };
  });

const uploadImageFn = createServerFn({ method: "POST" })
  .validator((data) => {
    if (!(data instanceof FormData)) throw new Error("Expected an image file.");
    const file = data.get("file");
    if (!(file instanceof Blob) || file.size === 0) throw new Error("Choose an image to upload.");
    return { file };
  })
  .handler(async ({ data: { file } }) => {
    const fileId = crypto.randomUUID().replace(/-/g, "").slice(0, 32);
    const filename = "name" in file && typeof file.name === "string" && file.name ? file.name : "product.jpg";
    const form = new FormData();
    form.append("fileId", fileId);
    form.append("file", file, filename);
    form.append("permissions[]", 'read("any")');

    const res = await appwriteFetch(`/storage/buckets/${storageBucketId}/files`, {
      method: "POST",
      body: form,
    });
    const body = await parseBody(res);
    if (!res.ok) throw new Error(body.message ?? `Image upload failed (${res.status})`);
    return fileViewUrl(body.$id ?? fileId);
  });

export async function listAppwriteProducts(): Promise<AppwriteProductRow[]> {
  return listProductsFn();
}

export async function upsertAppwriteProduct(id: string, data: Record<string, unknown>) {
  return upsertProductFn({ data: { id, data } });
}

export async function deleteAppwriteProduct(id: string) {
  return deleteProductFn({ data: { id } });
}

export async function uploadProductImage(file: File): Promise<string> {
  if (file.size > 4_000_000) {
    throw new Error("Please use an image smaller than 4 MB.");
  }
  const form = new FormData();
  form.append("file", file);
  return uploadImageFn({ data: form });
}
