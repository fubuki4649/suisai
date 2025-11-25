import {Album, Photo} from "../models/model.ts";
import {client} from "./client.ts";
import {withAxiosErrorHandling} from "./AxiosErrorHandling.ts";

// Get the root albums ("Top level" albums with no parent)
export async function getRootAlbums(onHttpError: (code: number) => void = () => {}): Promise<Album[]> {
  return withAxiosErrorHandling<Album[]>([], onHttpError, async (): Promise<Album[]> => {

    // Get albums from the server
    const albums = (await client.get<Album[]>("/album/root")).data;
    // Set photos to null because we'll load them later
    for (const album of albums) album.photos = null;

    // Add an "Unfiled Photos" album to the top of the list
    albums.unshift(
      {
        albumId: -1,
        albumName: "Unfiled Photos",
        photos: null,
      }
    );

    return albums;

  })();
}


// Query the photos in an album
export async function queryAlbum(albumId: number, onHttpError: (code: number) => void = () => {}): Promise<Photo[]> {
  return withAxiosErrorHandling<Photo[]>([], onHttpError, async (): Promise<Photo[]> => {

    if (albumId === -1) return (await client.get<Photo[]>("/album/unfiled/photos")).data;
    else return (await client.get<Photo[]>(`/album/${albumId}/photos`)).data;

  })();
}

// Create a new album
export async function createAlbum(albumName: string, onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {

    await client.post("/album/new", {albumName: albumName});
    return;

  })();
}

// Rename an album
export async function renameAlbum(albumId: number, albumName: string, onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {

    await client.patch(`/album/${albumId}/rename`, {albumName: albumName});
    return;

  })();
}

// Delete an album
export async function deleteAlbum(albumId: number, onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {

    await client.delete(`/album/${albumId}/delete`);
    return;

  })();
}