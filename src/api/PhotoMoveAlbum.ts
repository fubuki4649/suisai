import {withAxiosErrorHandling} from "./AxiosErrorHandling.ts";
import axios from "axios";

export async function unfilePhoto(photoIds: number[], onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {

    await axios.post(`http://localhost:8000/api/photo/album/unfile`, {photoIds: photoIds});
    return;

  })();
}

export async function movePhotoToAlbum(albumId: number, photoIds: number[], onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {

    await axios.post(`http://localhost:8000/api/photo/album/reassign`, {albumId: albumId, photoIds: photoIds});
    return;

  })();
}