import {Album, Photo} from "../models/model.ts";
import axios from "axios";
import {withAxiosErrorHandling} from "./AxiosErrorHandling.ts";


export async function getAlbums(onHttpError: (code: number) => void = () => {}): Promise<Album[]> {
  return withAxiosErrorHandling<Album[]>([], onHttpError, async (): Promise<Album[]> => {

    const albums = (await axios.get<Album[]>("http://localhost:8000/api/album/all")).data;
    for (const album of albums) album.photos = null;

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

export async function queryAlbum(albumId: number, onHttpError: (code: number) => void = () => {}): Promise<Photo[]> {
  return withAxiosErrorHandling<Photo[]>([], onHttpError, async (): Promise<Photo[]> => {

    if (albumId === -1) return (await axios.get<Photo[]>("http://localhost:8000/api/album/unfiled/photos")).data;
    else return (await axios.get<Photo[]>(`http://localhost:8000/api/album/${albumId}/photos`)).data;

  })();
}


export async function createAlbum(albumName: string, onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {

    await axios.post("http://localhost:8000/api/album/new", {albumName: albumName});
    return;

  })();
}


export async function renameAlbum(albumId: number, albumName: string, onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {

    await axios.patch(`http://localhost:8000/api/album/${albumId}/rename`, {albumName: albumName});
    return;

  })();
}


export async function deleteAlbum(albumId: number, onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {

    await axios.delete(`http://localhost:8000/api/album/${albumId}/delete`);
    return;

  })();
}