import {Album, Photo} from "../models/model.ts";
import axios from "axios";
import {withAxiosErrorHandling} from "./AxiosErrorHandling.ts";


export async function getAlbums(onHttpError: (code: number) => void = () => {}): Promise<Album[]> {
  return withAxiosErrorHandling<Album[]>([], onHttpError, async (): Promise<Album[]> => {

    const albums = (await axios.get<Album[]>("http://localhost:8000/api/album/all")).data;
    albums.unshift(
      {
        albumId: -1,
        albumName: "Unfiled Photos",
        photos: (await axios.get<Photo[]>("http://localhost:8000/api/album/unfiled/photos")).data
      }
    );

    return albums;

  })();
}


export async function createAlbum(albumName: string, onHttpError: (code: number) => void = () => {}): Promise<void> {
  return withAxiosErrorHandling<void>(undefined, onHttpError, async (): Promise<void> => {

    await axios.post("http://localhost:8000/api/album/new", {albumName: albumName});
    return;

  })();
}