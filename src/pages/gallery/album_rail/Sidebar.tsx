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
      <div className="p-4 pt-2">

        <RenameAlbumModal disclosure={renameAlbumDisclosure} album={rightClickAlbum} />
        <MoveAlbumModal disclosure={moveAlbumDisclosure} album={rightClickAlbum} />
        <DeleteAlbumModal disclosure={deleteAlbumDisclosure} album={rightClickAlbum} />

        <ul className="space-y-1">
          {albums.map(album => (
            <ShowAlbum
              depth={1}
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
  depth,
  album,
  selectedAlbum,
  onAlbumSelect,
  setRightClickAlbum,
  renameAlbumDisclosure,
  moveAlbumDisclosure,
  deleteAlbumDisclosure,
}: {
  // Depth of the album in the tree, used to render client-side decorations
  depth: number,
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
    <li key={album.albumId}>
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

          <div className="flex flex-row">

            {Array(depth).fill(null).map(() => (
              <span className="self-stretch w-[2px] bg-default-300 dark:bg-default-200 mx-2 mt-1" />
            ))}

            <ul id={album.albumId.toString()} className="flex-grow space-y-1 mt-1">
              {album.children.map(album => (
                <ShowAlbum
                  depth={depth+1}
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
          </div>
        )
      }
    </li>
  )
}

export default Sidebar
