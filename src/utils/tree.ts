import {Collection} from "../types/models.ts";

// Find a collection by its ID in a tree of collections via BFS
export function findCollectionByID(id: string, collections: Collection[]): Collection | undefined {
  const queue: Collection[] = [...collections];

  while (queue.length > 0) {
    const collection = queue.shift()!;

    if (collection.id === id) return collection;
    if (collection.children && collection.children.length > 0) {
      queue.push(...collection.children);
    }
  }
  return undefined;
}

