import {Collection} from "../types/models.ts";
import PriorityQueue from "js-priority-queue";

// Find a collection by its ID in a tree of collections via BFS
export function findCollectionByID(id: string, collections: Collection[]): Collection | undefined {
  const pq = new PriorityQueue<Collection>();

  for (const collection of collections) pq.queue(collection);

  while (pq.length > 0) {
    const collection = pq.dequeue();

    if (collection.id === id) return collection;
    for (const child of collection.children) pq.queue(child);
  }
  return undefined;
}
