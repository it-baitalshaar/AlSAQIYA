/**
 * Appwrite catalogue API.
 * Browser calls go through TanStack server functions so Vercel / alsaqiya.ae
 * are not blocked by Appwrite CORS (the "Failed to fetch" error).
 *
 * Al Saqia Trading uses a TablesDB database. The public REST surface that
 * actually accepts guest reads/writes is the Databases documents API
 * (`/databases/.../documents`). `/tablesdb/...` returns HTML 404s, so that
 * path must not be treated as a successful save.
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

const documentsPath = `/databases/${databaseId}/collections/${productsCollectionId}/documents`;

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
    Accept: "application/json",
    ...extra,
  });
  const apiKey = process.env["APPWRITE_API_KEY"];
  if (apiKey) headers.set("X-Appwrite-Key", apiKey);
  return headers;
}

function isJsonResponse(res: Response) {
  return (res.headers.get("content-type") ?? "").includes("application/json");
}

function errorMessage(body: Record<string, unknown>, status: number, fallback: string) {
  const message = body.message;
  if (typeof message === "string" && message.trim() && !message.trim().startsWith("<")) {
    return message;
  }
  const type = body.type;
  if (typeof type === "string" && type) return `${fallback} (${type})`;
  return `${fallback} (${status})`;
}

async function parseBody(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  try {
    return text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

async function appwriteJson(path: string, init: RequestInit = {}) {
  const headers = await appwriteHeaders(init.headers);
  const res = await fetch(`${endpoint}${path}`, { cache: "no-store", ...init, headers });
  const body = await parseBody(res);
  const json = isJsonResponse(res);
  return { res, body, json, ok: res.ok && json };
}

function flattenRow(row: Record<string, unknown>): AppwriteProductRow {
  const nested =
    row.data && typeof row.data === "object" && !Array.isArray(row.data)
      ? (row.data as Record<string, unknown>)
      : {};
  const { data: _data, ...rest } = row;
  return { ...rest, ...nested, $id: String(row.$id ?? "") } as AppwriteProductRow;
}

function rowsFrom(body: Record<string, unknown>) {
  const list = (body.rows ?? body.documents ?? []) as Record<string, unknown>[];
  return Array.isArray(list) ? list.map(flattenRow) : [];
}

function savedRow(body: Record<string, unknown>) {
  const row = flattenRow(body);
  if (!row.$id) {
    throw new Error("Appwrite did not return a saved product id.");
  }
  return row;
}

const listProductsFn = createServerFn({ method: "POST" }).handler(async () => {
  const query = encodeURIComponent(JSON.stringify({ method: "limit", values: [500] }));
  const docs = await appwriteJson(`${documentsPath}?queries[]=${query}`);
  if (!docs.ok) {
    throw new Error(errorMessage(docs.body, docs.res.status, "Appwrite list failed"));
  }

  const rows = rowsFrom(docs.body);
  // Appwrite 2 list omits a column named `collection` (reserved vs $collectionId).
  // Individual document reads still return it, so fill any blanks.
  return Promise.all(
    rows.map(async (row) => {
      if (row.collection) return row;
      const one = await appwriteJson(`${documentsPath}/${row.$id}`);
      return one.ok ? flattenRow(one.body) : row;
    }),
  );
});

const upsertProductFn = createServerFn({ method: "POST" })
  .validator((input: { id: string; data: Record<string, unknown> }) => input)
  .handler(async ({ data: { id, data } }) => {
    const create = await appwriteJson(documentsPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: id, data }),
    });
    if (create.ok) return savedRow(create.body);

    const patch = await appwriteJson(`${documentsPath}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
    if (patch.ok) return savedRow(patch.body);

    throw new Error(
      errorMessage(patch.body, patch.res.status, errorMessage(create.body, create.res.status, "Appwrite save failed")),
    );
  });

const deleteProductFn = createServerFn({ method: "POST" })
  .validator((input: { id: string }) => input)
  .handler(async ({ data: { id } }) => {
    const doc = await appwriteJson(`${documentsPath}/${id}`, { method: "DELETE" });
    if (doc.ok || doc.res.status === 204 || doc.res.status === 404) return { ok: true };
    throw new Error(errorMessage(doc.body, doc.res.status, "Appwrite delete failed"));
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
    const filename =
      "name" in file && typeof file.name === "string" && file.name ? file.name : "product.jpg";
    const form = new FormData();
    form.append("fileId", fileId);
    form.append("file", file, filename);
    form.append("permissions[]", 'read("any")');

    const res = await appwriteJson(`/storage/buckets/${storageBucketId}/files`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) throw new Error(errorMessage(res.body, res.res.status, "Image upload failed"));
    return fileViewUrl(String(res.body.$id ?? fileId));
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
