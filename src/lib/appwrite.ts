/**
 * Appwrite configuration (MOCK VALUES).
 *
 * Replace these with the real project credentials later, or move them into
 * environment variables (VITE_APPWRITE_*). Nothing here performs a network
 * request yet — the catalog store in `products.ts` reads/writes locally and is
 * shaped so it can be swapped for Appwrite Databases + Storage calls 1:1.
 */
export const appwriteConfig = {
  endpoint: import.meta.env["VITE_APPWRITE_ENDPOINT"] ?? "https://cloud.appwrite.io/v1",
  projectId: import.meta.env["VITE_APPWRITE_PROJECT_ID"] ?? "mock-project-id",
  apiKey: import.meta.env["VITE_APPWRITE_API_KEY"] ?? "mock-api-key-replace-me",
  databaseId: import.meta.env["VITE_APPWRITE_DATABASE_ID"] ?? "mock-database-id",
  productsCollectionId:
    import.meta.env["VITE_APPWRITE_PRODUCTS_COLLECTION_ID"] ?? "mock-products-collection",
  storageBucketId: import.meta.env["VITE_APPWRITE_BUCKET_ID"] ?? "mock-product-images-bucket",
} as const;
