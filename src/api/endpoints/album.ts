import {Album, Photo} from "../models.ts";
import {client} from "../client.ts";
import {withAxiosErrorHandling} from "../axios-error-handling.ts";

// Get the album tree
export async function getAlbums(onHttpError: (code: number) => void = () => {}): Promise<Album[]> {
  return withAxiosErrorHandling<Album[]>([], onHttpError, async (): Promise<Album[]> => {

    // Get albums from the server
    const root = (await client.get<Album>("/album/tree")).data;
    // Since the list of photos for each album is lazy loaded, let's traverse the tree first and set it to `null` for each album
    const setPhotosToNull = (node: Album) => {
      node.photos = null;
      console.log(node.albumName);
      for (const child of node.children) setPhotosToNull(child);
    }
    console.log(root);
    setPhotosToNull(root);

    // Now, grab the list of "root level" albums
    const albums = root.children;
    // Add an "Unfiled Photos" album to the top of the list
    albums.unshift(
      {
        albumId: -1,
        albumName: "Unfiled Photos",
        photos: null,
        children: [],
      }
    );

    return albums;
  })();
}


// Query the photos in an album
export async function queryAlbum(albumId: number, onHttpError: (code: number) => void = () => {}): Promise<Photo[]> {
  return withAxiosErrorHandling<Photo[]>([], onHttpError, async (): Promise<Photo[]> => {

    // If the album ID is -1, query the unfiled photos endpoint. Otherwise, query the album endpoint.
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

// Delete an album, moving all its contents to root level/unfiled
export async function deleteAlbum(albumId: number, onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {

    await client.delete(`/album/${albumId}/delete`);
    return;

  })();
}