import {Asset, Collection, CollectionTree} from "../types/models.ts";
import {client} from "./client.ts";
import {withAxiosErrorHandling} from "./error-handling.ts";

// Get the collection tree
export async function getCollections(onHttpError: (code: number) => void = () => undefined): Promise<Collection[]> {
  return withAxiosErrorHandling<Collection[]>([], onHttpError, async (): Promise<Collection[]> => {
    // Get collections tree from the server
    const root = (await client.get<CollectionTree>("/collection/tree")).data;

    // Convert CollectionTree nodes to Collection nodes and set assets to null for lazy loading
    const formatNode = (node: CollectionTree): Collection => {
      return {
        id: node.id,
        label: node.label,
        assets: null,
        children: node.children.map(formatNode),
      };
    };

    const formattedRoot = formatNode(root);

    // Grab the list of "root level" collections
    const collections = formattedRoot.children;

    // Add an "Unfiled Assets" collection to the top of the list
    collections.unshift({
      id: "-1",
      label: "Unfiled Assets",
      assets: null,
      children: [],
    });

    return collections;
  })();
}

export async function getCollectionsFlat(onHttpError: (code: number) => void = () => undefined): Promise<Collection[]> {
  return withAxiosErrorHandling<Collection[]>([], onHttpError, async (): Promise<Collection[]> => {
    // Get collections from the server
    const collections = (await client.get<Collection[]>("/collection/flat")).data;
    collections.forEach((collection) => {
      collection.assets = null;
      collection.children = [];
    });

    // Add an "Unfiled Assets / Root Level" collection to the top of the list
    collections.unshift({
      id: "-1",
      label: "Unfiled Assets / Root Level",
      assets: null,
      children: [],
    });

    return collections;
  })();
}

// Query the assets in a collection
export async function queryCollection(collectionId: string, onHttpError: (code: number) => void = () => undefined): Promise<Asset[]> {
  return withAxiosErrorHandling<Asset[]>([], onHttpError, async (): Promise<Asset[]> => {
    // If the collection ID is "-1", query the unfiled assets endpoint. Otherwise, query the collection endpoint.
    if (collectionId === "-1") {
      return (await client.get<Asset[]>("/collection/unfiled/assets")).data;
    } else {
      return (await client.get<Asset[]>(`/collection/${collectionId}/assets`)).data;
    }
  })();
}

// Create a new collection
export async function createCollection(label: string, parentId?: string | null, onHttpError: (code: number) => void = () => undefined): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {
    await client.post("/collection/new", {label, parentId: parentId ?? null});
  })();
}

// Rename a collection
export async function renameCollection(collectionId: string, label: string, onHttpError: (code: number) => void = () => undefined): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {
    await client.patch(`/collection/${collectionId}/rename`, {label});
  })();
}

// Delete a collection, moving all its contents to root level/unfiled
export async function deleteCollection(collectionId: string, onHttpError: (code: number) => void = () => undefined): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {
    await client.delete(`/collection/${collectionId}/delete`);
  })();
}
