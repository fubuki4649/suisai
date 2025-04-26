import {Button, Spacer} from "@heroui/react";
import React from "react";
import {Album} from "../../../models/model.ts";
import {useAlbums, useSelectedAlbum} from "../../../models/GlobalContext.tsx";
import NewAlbumBtn from "./NewAlbumBtn.tsx";
import RightClickButton from "./RightClickButton.tsx";


function Sidebar() {

  const [albums] = useAlbums();
  const [selectedAlbum, setSelectedAlbum] = useSelectedAlbum();


  // Hook for selecting an album
  const onAlbumSelect = (album: Album) => {
    setSelectedAlbum(album)
  }

  return (
    <div className="flex flex-col bg-background p-4 space-y-2">

      {albums.map(album => (
        <Button onPress={() => onAlbumSelect(album)} className="px-6" color="default" variant={selectedAlbum?.albumId == album.albumId ? "flat" : "light"}>
          {album.albumName}
        </Button>
      ))}

      <Spacer className="h-1"/>
      <NewAlbumBtn />
      <Spacer className="h-1"/>
      <RightClickButton />

    </div>
  )
}

export default Sidebar
