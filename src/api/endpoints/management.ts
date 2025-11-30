import {withAxiosErrorHandling} from "../axios-error-handling.ts";
import {client} from "../client.ts";

// Unfile a photo (set its parent album to none)
export async function unfilePhoto(photoIds: number[], onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {

    await client.post(`/management/photo/unfile`, {photoIds: photoIds});
    return;

  })();
}

// Move a photo (set its parent album to something else)
export async function movePhoto(albumId: number, photoIds: number[], onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {

    await client.post(`/management/photo/reassign`, {albumId: albumId, photoIds: photoIds});
    return;

  })();
}

// Unfile an album (move an album along with its contents to root level)
export async function unfileAlbum(albumIds: number[], onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {

    await client.post(`/management/album/unfile`, {albumIds: albumIds});
    return;

  })();
}

// Move an album (move an album along with its contents to another album)
export async function moveAlbum(parentId: number, albumIds: number[], onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {

    await client.post(`/management/album/reassign`, {parentId: parentId, albumIds: albumIds});
    return;

  })();
}