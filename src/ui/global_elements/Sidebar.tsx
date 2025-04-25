import {Button, cn, Popover, PopoverContent, PopoverTrigger, Spacer} from "@heroui/react";
import React from "react";
import {PlusIcon} from "@heroicons/react/16/solid";
import {Album} from "../../models/model.ts";
import {useAlbums, useDarkMode, useSelectedAlbum} from "../../models/GlobalContext.tsx";


function Sidebar() {

  const [albums] = useAlbums();
  const [darkMode] = useDarkMode();
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
      <Popover placement="right">
        <PopoverTrigger>
          <Button color="default" variant="ghost" endContent={<PlusIcon className={"size-6"}/>}>
            <Spacer className="w-0"/>
            <p className="font-semibold">Add Album</p>
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn(darkMode && "dark text-foreground")}>
          <div className="px-1 py-2">
            <div className="text-small font-bold">Popover Content</div>
            <div className="text-tiny">This is the popover content</div>
          </div>
        </PopoverContent>
      </Popover>


    </div>
  )
}

export default Sidebar
