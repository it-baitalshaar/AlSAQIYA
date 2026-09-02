/**
 * Al Saqiya Appwrite project (cloud, Frankfurt).
 * Project ID is public; table/bucket permissions currently allow guest read & write
 * so the admin panel can work without a login. Tighten this before going live.
 */
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

function headers(extra?: HeadersInit): Headers {
  return new Headers({
    "X-Appwrite-Project": projectId,
    ...extra,
  });
}

async function parseBody(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
}

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

export async function listAppwriteProducts(): Promise<AppwriteProductRow[]> {
  const url = `${endpoint}/tablesdb/databases/${databaseId}/tables/${productsCollectionId}/rows?queries[]=${encodeURIComponent("limit(500)")}`;
  const res = await fetch(url, { headers: headers() });
  const body = await parseBody(res);
  if (!res.ok) throw new Error(body.message ?? `Appwrite list failed (${res.status})`);
  return (body.rows ?? body.documents ?? []) as AppwriteProductRow[];
}

export async function upsertAppwriteProduct(id: string, data: Record<string, unknown>) {
  const payload = JSON.stringify({ rowId: id, data });
  const createUrl = `${endpoint}/tablesdb/databases/${databaseId}/tables/${productsCollectionId}/rows`;
  const createRes = await fetch(createUrl, {
    method: "POST",
    headers: headers({ "Content-Type": "application/json" }),
    body: payload,
  });
  if (createRes.ok) return parseBody(createRes);

  const updateUrl = `${endpoint}/tablesdb/databases/${databaseId}/tables/${productsCollectionId}/rows/${id}`;
  const updateRes = await fetch(updateUrl, {
    method: "PATCH",
    headers: headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ data }),
  });
  const body = await parseBody(updateRes);
  if (!updateRes.ok) throw new Error(body.message ?? `Appwrite save failed (${updateRes.status})`);
  return body;
}

export async function deleteAppwriteProduct(id: string) {
  const url = `${endpoint}/tablesdb/databases/${databaseId}/tables/${productsCollectionId}/rows/${id}`;
  const res = await fetch(url, { method: "DELETE", headers: headers() });
  if (!res.ok && res.status !== 404) {
    const body = await parseBody(res);
    throw new Error(body.message ?? `Appwrite delete failed (${res.status})`);
  }
}

export async function uploadProductImage(file: File): Promise<string> {
  const fileId = crypto.randomUUID().replace(/-/g, "").slice(0, 36);
  const form = new FormData();
  form.append("fileId", fileId);
  form.append("file", file);
  const url = `${endpoint}/storage/buckets/${storageBucketId}/files`;
  const res = await fetch(url, { method: "POST", headers: headers(), body: form });
  const body = await parseBody(res);
  if (!res.ok) throw new Error(body.message ?? `Image upload failed (${res.status})`);
  return fileViewUrl(body.$id ?? fileId);
}
