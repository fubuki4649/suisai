import {addToast, Spacer, useDisclosure} from "@heroui/react";
import React, {useState} from "react";
import {Album} from "../../../models/model.ts";
import {useAlbums, useSelectedAlbum, useSelectedPhotos} from "../../../models/GlobalContext.tsx";
import NewAlbumBtn from "./NewAlbumBtn.tsx";
import AlbumButton from "./AlbumButton.tsx";
import RenameAlbumModal from "./album_modals/RenameAlbumModal.tsx";
import DeleteAlbumModal from "./album_modals/DeleteAlbumModal.tsx";
import {Disclosure} from "../../../models/modal-disclosure.ts";
import {queryAlbum} from "../../../api/endpoints/album.ts";


function Sidebar() {

  const [albums] = useAlbums();
  const [selectedAlbum, setSelectedAlbum] = useSelectedAlbum();
  const [, setSelectedPhotos] = useSelectedPhotos();

  // Stores state for the modal dialogues
  const [rightClickAlbum, setRightClickAlbum] = useState<Album>(selectedAlbum ?? albums[0]);

  // Hook for selecting an album
  const onAlbumSelect = (album: Album) => {
    if (album.photos != null) {
      setSelectedPhotos([])
      setSelectedAlbum(album)
    }
    else {
      queryAlbum(album.albumId, () => { addToast({
        title: "Error",
        description: `Failed to load the contents of album ${album.albumName} (ID ${album.albumId})`,
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      })}).then((photos) => {
        album.photos = photos
        setSelectedPhotos([])
        setSelectedAlbum(album)
      })
    }
  }

  const renameAlbumDisclosure: Disclosure = useDisclosure();
  const deleteAlbumDisclosure: Disclosure = useDisclosure();

  return (
    <div className="flex flex-col min-w-fit bg-background/50 overflow-auto scrollbar-hide">
      <div className="p-4 space-y-0.5">

        <RenameAlbumModal disclosure={renameAlbumDisclosure} album={rightClickAlbum} />
        <DeleteAlbumModal disclosure={deleteAlbumDisclosure} album={rightClickAlbum} />

        {albums.sort((a, b) => a.albumId - b.albumId).map(album => (
          <AlbumButton
            key={album.albumId}
            album={album}
            selectedAlbum={selectedAlbum}
            onAlbumSelect={onAlbumSelect}
            setRightClickAlbum={setRightClickAlbum}
            renameAlbumDisclosure={renameAlbumDisclosure}
            deleteAlbumDisclosure={deleteAlbumDisclosure}
          />
        ))}

        <Spacer className="h-0.5"/>
        <NewAlbumBtn />

      </div>
    </div>
  )
}

export default Sidebar
