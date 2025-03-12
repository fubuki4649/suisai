import {Button, Spacer} from "@heroui/react";
import React, {useState} from "react";
import {PlusIcon} from "@heroicons/react/24/solid";
import {Album} from "../model/objects.ts";


function Sidebar(props: {albums: Album[], selectedAlbum: (Album | null), setSelectedAlbum: (album: Album) => void}) {

  const onAlbumSelect = (album: Album) => {
    props.setSelectedAlbum(album)
  }

  return (

    <div className="flex flex-col bg-background p-4 space-y-2">

      {props.albums.map(album => (
        <Button onPress={() => onAlbumSelect(album)} className="px-6" color="default" variant={props.selectedAlbum?.albumId == album.albumId ? "flat" : "light"}>
          {album.albumName}
        </Button>
      ))}

      <Spacer className="h-1"/>
      <Button color="default" variant="ghost" endContent={<PlusIcon className={"size-6"}/>}>
        <Spacer className="w-0"/>
        <p className="font-semibold">Add Album</p>
      </Button>

    </div>

  )
}

export default Sidebar
