import {Collection} from "../types/models.ts";

// Find a collection by its ID in a tree of collections via BFS
export function findCollectionByID(id: string, collections: Collection[]): Collection | undefined {
  const queue: Collection[] = [...collections];

  while (queue.length) {
    const collection = queue.shift()!;
    if (collection.id === id) return collection;
    queue.push(...collection.children);
  }
  return undefined;
}

// Update a collection node anywhere in the tree immutably
export function updateCollectionInTree(
  cols: Collection[],
  id: string,
  updater: (col: Collection) => Collection
): Collection[] {
  return cols.map((col) => {
    if (col.id === id) return updater(col);
    if (col.children.length > 0) {
      return {...col, children: updateCollectionInTree(col.children, id, updater)};
    }
    return col;
  });
}

// Gather all descendant collection IDs recursively (including the collection itself)
export function getCollectionDescendantIds(col: Collection): string[] {
  return [col.id, ...col.children.flatMap(getCollectionDescendantIds)];
}


