import {useAlbums, useDarkMode, useSelectedPhotos} from "../../../../models/GlobalContext.tsx";
import React, {useState} from "react";
import {deleteAlbum, getAlbums} from "../../../../api/Album.ts";
import {
  addToast,
  Button,
  cn, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer
} from "@heroui/react";
import {Album} from "../../../../models/model.ts";
import {AlbumModalProps} from "../../../global_elements/sidebar/album_modals/ViewModel.ts";
import {Disclosure} from "../../../ViewModel.ts";

export default function MovePhotoModal(disclosure : Disclosure) {

  const [darkMode] = useDarkMode();
  const [selectedPhotos] = useSelectedPhotos();
  const [albums] = useAlbums();

  const {isOpen, onOpen, onOpenChange} = disclosure;
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  // Event handler for move photo button
  const onDeleteAlbum = () => {
    // deleteAlbum(selectedAlbum?.albumId ?? -1, (code) => {
    //   addToast({
    //     title: "Error",
    //     description: "Failed to delete album with code " + code,
    //     color: "danger",
    //     timeout: 5000,
    //     shouldShowTimeoutProgress: true,
    //   })
    // }).then(() => {
    //   addToast({
    //     title: "Success",
    //     description: "Successfully moved ${selectedPhotos.length} photos to album ${selectedAlbum.albumName} (ID: ${selectedAlbum?.albumId})",
    //     color: "success",
    //     timeout: 5000,
    //     shouldShowTimeoutProgress: true,
    //   });
    //   getAlbums().then((albums: Album[]) => {
    //     console.log(albums);
    //     setAlbums(albums);
    //   });
    // })
  }

  return (
    <>
      <Modal
        className={cn(darkMode && "dark text-foreground")}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={() => {
          onOpenChange();
          setSelectedAlbum(null);
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Move Photos</ModalHeader>
              <ModalBody>

                <p>
                  Moving {selectedPhotos.length} {selectedPhotos.length == 1 ? "photo" : "photos"} to the following album
                </p>

                <Spacer className="h-1"/>

                <Dropdown className={cn(darkMode && "dark text-foreground")} placement="bottom-start">
                  <DropdownTrigger>
                    <div>
                      <Input
                        isReadOnly
                        label="Destination Album"
                        value={selectedAlbum?.albumName ?? ""}
                        type="text"
                        placeholder="Select Album"
                        size="md"
                        labelPlacement="inside"
                      />
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Dynamic Actions" items={albums}>
                    {(album) => (
                      <DropdownItem key={album.albumId} onPress={() => {setSelectedAlbum(album);}}>
                        {album.albumName} (ID: {album.albumId})
                      </DropdownItem>
                    )}
                  </DropdownMenu>
                </Dropdown>

              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={() => {onDeleteAlbum(); onClose();}} isDisabled={selectedAlbum == null}>
                  {selectedPhotos.length == 1 ? "Move Photo" : "Move Photos"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}