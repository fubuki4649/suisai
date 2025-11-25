import {withAxiosErrorHandling} from "./AxiosErrorHandling.ts";
import {client} from "./client.ts";

export async function unfilePhoto(photoIds: number[], onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {

    await client.post(`/management/photo/unfile`, {photoIds: photoIds});
    return;

  })();
}

export async function movePhotoToAlbum(albumId: number, photoIds: number[], onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {

    await client.post(`/management/photo/reassign`, {albumId: albumId, photoIds: photoIds});
    return;

  })();
}