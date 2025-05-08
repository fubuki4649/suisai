import {Spacer, useDisclosure} from "@heroui/react";
import React, {useState} from "react";
import {Album} from "../../../models/model.ts";
import {useAlbums, useSelectedAlbum} from "../../../models/GlobalContext.tsx";
import NewAlbumBtn from "./NewAlbumBtn.tsx";
import RightClickButton from "./RightClickButton.tsx";
import RenameAlbumModal from "./album_modals/RenameAlbumModal.tsx";
import DeleteAlbumModal from "./album_modals/DeleteAlbumModal.tsx";

import {Disclosure} from "../../ViewModel.ts";


function Sidebar() {

  const [albums] = useAlbums();
  const [selectedAlbum, setSelectedAlbum] = useSelectedAlbum();

  // Stores state for the modal dialogues
  const [rightClickAlbum, setRightClickAlbum] = useState<Album>(selectedAlbum ?? albums[0]);

  // Hook for selecting an album
  const onAlbumSelect = (album: Album) => {
    setSelectedAlbum(album)
  }

  const renameAlbumDisclosure: Disclosure = useDisclosure();
  const deleteAlbumDisclosure: Disclosure = useDisclosure();

  return (
    <div className="flex flex-col bg-background/50 p-4 space-y-2">

      <RenameAlbumModal disclosure={renameAlbumDisclosure} album={rightClickAlbum} />
      <DeleteAlbumModal disclosure={deleteAlbumDisclosure} album={rightClickAlbum} />

      {albums.sort((a, b) => a.albumId - b.albumId).map(album => (
        <RightClickButton key={album.albumId} btnProps={{
          className: "px-6",
          children: album.albumName,
          color: "default",
          variant: selectedAlbum?.albumId == album.albumId ? "flat" : "light",
          onPress: () => onAlbumSelect(album),
        }}
        rightClickItems={[
          {
            key: "rename",
            children: "Rename",
            isDisabled: album.albumId < 0,
            onPress: () => {
              setRightClickAlbum(album)
              renameAlbumDisclosure.onOpen()
            },
          },
          {
            key: "delete",
            className: "text-danger",
            color: "danger",
            children: "Delete",
            isDisabled: album.albumId < 0,
            onPress: () => {
              setRightClickAlbum(album)
              deleteAlbumDisclosure.onOpen()
            },
          }
        ]}/>
      ))}

      <Spacer className="h-1"/>
      <NewAlbumBtn />

    </div>
  )
}

export default Sidebar
