import {Album, Photo} from "../models/model.ts";
import axios from "axios";


export async function getAlbums(): Promise<Album[]> {
  try {
    const albums = (await axios.get<Album[]>("http://localhost:8000/api/album/all")).data;
    albums.unshift(
      {
        albumId: -1,
        albumName: "Unfiled Photos",
        photos: (await axios.get<Photo[]>("http://localhost:8000/api/album/unfiled/photos")).data
      }
    );

    return albums;
  }
  catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}
