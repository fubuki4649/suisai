import {Album} from "../api/models.ts";
import PriorityQueue from "js-priority-queue";

// Find an album by its ID in a tree of albums via BFS
export function findAlbumByID(id: number, albums: Album[]) {
  const pq = new PriorityQueue<Album>();

  for (const album of albums) pq.queue(album);

  while (pq.length > 0) {
    const album = pq.dequeue();

    if (album.albumId === id) return album;
    for (const child of album.children) pq.queue(child);
  }
}