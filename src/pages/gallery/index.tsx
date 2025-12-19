import React, {ReactNode, useEffect} from "react";
import {useAlbums} from "../../components/GlobalContext.tsx";
import {getAlbums} from "../../api/endpoints/album.ts";
import {Album} from "../../api/models.ts";
import Sidebar from "./album_rail/Sidebar.tsx";


export default function Gallery ({ children }: { children: ReactNode }) {

  const [, setAlbums] = useAlbums();

  // Update cards on album change/load
  useEffect(() => {
    getAlbums().then((albums: Album[]) => {
      setAlbums(albums);
    })
  }, []);

  return (
    <div className="flex flex-row flex-grow overflow-y-auto">
      <Sidebar />
      { children }
    </div>
  )
}
