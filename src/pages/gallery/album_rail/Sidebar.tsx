import {addToast, Spacer, useDisclosure} from "@heroui/react";
import React, {JSX, useState} from "react";
import {useAlbums, useSelectedAlbum, useSelectedPhotos} from "../../../components/GlobalContext.tsx";
import NewAlbumBtn from "./NewAlbumBtn.tsx";
import AlbumButton from "./AlbumButton.tsx";
import RenameAlbumModal from "./album_modals/RenameAlbumModal.tsx";
import DeleteAlbumModal from "./album_modals/DeleteAlbumModal.tsx";
import {Disclosure} from "../../../components/modal-disclosure.ts";
import {queryAlbum} from "../../../api/endpoints/album.ts";
import {Album} from "../../../api/models.ts";
import MoveAlbumModal from "./album_modals/MoveAlbumModal.tsx";


function Sidebar() {

  const [albums] = useAlbums();
  const [selectedAlbum, setSelectedAlbum] = useSelectedAlbum();
  const [, setSelectedPhotos] = useSelectedPhotos();

  // Stores state for the modal dialogues
  const [rightClickAlbum, setRightClickAlbum] = useState<Album>(selectedAlbum ?? albums[0]);

  // Hook for selecting an album
  const onAlbumSelect = (album: Album) => {
    // If album has already been loaded, select album
    if (album.photos != null) {
      setSelectedPhotos([])
      setSelectedAlbum(album)
    }
    // Otherwise, load album (contents), then select album
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
  const moveAlbumDisclosure: Disclosure = useDisclosure();
  const deleteAlbumDisclosure: Disclosure = useDisclosure();


  return (
    <div className="flex flex-col min-w-fit bg-background/50 overflow-auto scrollbar-hide">
      <div className="p-4">

        <RenameAlbumModal disclosure={renameAlbumDisclosure} album={rightClickAlbum} />
        <MoveAlbumModal disclosure={moveAlbumDisclosure} album={rightClickAlbum} />
        <DeleteAlbumModal disclosure={deleteAlbumDisclosure} album={rightClickAlbum} />

        <ul className="space-y-1">
          {albums.map(album => (
            <ShowAlbum
              key={album.albumId}
              album={album}
              selectedAlbum={selectedAlbum}
              onAlbumSelect={onAlbumSelect}
              setRightClickAlbum={setRightClickAlbum}
              renameAlbumDisclosure={renameAlbumDisclosure}
              moveAlbumDisclosure={moveAlbumDisclosure}
              deleteAlbumDisclosure={deleteAlbumDisclosure}
            />
          ))}
        </ul>

        <Spacer className="h-0.5"/>
        <NewAlbumBtn />

      </div>
    </div>
  )
}

const ShowAlbum = ({
  album,
  selectedAlbum,
  onAlbumSelect,
  setRightClickAlbum,
  renameAlbumDisclosure,
  moveAlbumDisclosure,
  deleteAlbumDisclosure,
}: {
  album: Album,
  selectedAlbum: Album | null,
  onAlbumSelect: (album: Album) => void,
  setRightClickAlbum: (album: Album) => void,
  renameAlbumDisclosure: Disclosure,
  moveAlbumDisclosure: Disclosure,
  deleteAlbumDisclosure: Disclosure,
}): JSX.Element => {

  const [expanded, setExpanded] = useState(false);

  return (
    <li>
      {/* Display Album Button */}
      <AlbumButton
        key={album.albumId}
        expanded={expanded}
        album={album}
        selectedAlbum={selectedAlbum}
        onAlbumSelect={(album: Album) => {
          if (album.children && album.children.length > 0) setExpanded(prev => !prev);
          onAlbumSelect(album)
        }}
        setRightClickAlbum={setRightClickAlbum}
        renameAlbumDisclosure={renameAlbumDisclosure}
        moveAlbumDisclosure={moveAlbumDisclosure}
        deleteAlbumDisclosure={deleteAlbumDisclosure}
      />

      {/* Display Album Children */}
      {
        expanded && album.children && album.children.length > 0 && (
          <ul className="space-y-1 mt-1" id={album.albumId.toString()}>
            {album.children.map(album => (
              <ShowAlbum
                key={album.albumId}
                album={album}
                selectedAlbum={selectedAlbum}
                onAlbumSelect={onAlbumSelect}
                setRightClickAlbum={setRightClickAlbum}
                renameAlbumDisclosure={renameAlbumDisclosure}
                moveAlbumDisclosure={moveAlbumDisclosure}
                deleteAlbumDisclosure={deleteAlbumDisclosure}
              />
            ))}
          </ul>
        )
      }
    </li>
  )
}

export default Sidebar
