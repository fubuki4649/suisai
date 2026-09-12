import {Asset, Collection, CollectionTree} from "../types/models.ts";
import {client} from "./client.ts";
import {withAxiosErrorHandling} from "./error-handling.ts";

// Get the collection tree
export async function getCollections(onHttpError: (code: number) => void = () => undefined): Promise<Collection[]> {
  return withAxiosErrorHandling<Collection[]>([], onHttpError, async () => {
    const root = (await client.get<CollectionTree>("/collection/tree")).data;

    // Convert CollectionTree nodes to Collection nodes with assets null for lazy loading
    const formatNode = (node: CollectionTree): Collection => ({
      id: node.id,
      label: node.label,
      assets: null,
      children: node.children.map(formatNode),
    });

    const collections = formatNode(root).children;
    collections.unshift({id: "-1", label: "Unfiled Assets", assets: null, children: []});
    return collections;
  })();
}

export async function getCollectionsFlat(onHttpError: (code: number) => void = () => undefined): Promise<Collection[]> {
  return withAxiosErrorHandling<Collection[]>([], onHttpError, async () => {
    const collections = (await client.get<Collection[]>("/collection/flat")).data
      .map((c) => ({...c, assets: null, children: []}));
    collections.unshift({id: "-1", label: "Unfiled Assets / Root Level", assets: null, children: []});
    return collections;
  })();
}

// Query the assets in a collection
export async function queryCollection(collectionId: string, onHttpError: (code: number) => void = () => undefined): Promise<Asset[]> {
  return withAxiosErrorHandling<Asset[]>([], onHttpError, async () => {
    const url = collectionId === "-1" ? "/collection/unfiled/assets" : `/collection/${collectionId}/assets`;
    return (await client.get<Asset[]>(url)).data;
  })();
}

// Create a new collection
export async function createCollection(label: string, parentId?: string | null, onHttpError: (code: number) => void = () => undefined): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async () => {
    await client.post("/collection/new", {label, parentId: parentId ?? null});
  })();
}

// Rename a collection
export async function renameCollection(collectionId: string, label: string, onHttpError: (code: number) => void = () => undefined): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async () => {
    await client.patch(`/collection/${collectionId}/rename`, {label});
  })();
}

// Delete a collection, moving all its contents to root level/unfiled
export async function deleteCollection(collectionId: string, onHttpError: (code: number) => void = () => undefined): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async () => {
    await client.delete(`/collection/${collectionId}/delete`);
  })();
}
