import {useAlbums, useDarkMode, useSelectedAlbum, useSelectedPhotos} from "../../../../models/GlobalContext.tsx";
import React, {useState} from "react";
import {
  addToast,
  Button,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer
} from "@heroui/react";
import {Album} from "../../../../models/model.ts";
import {Disclosure} from "../../../ViewModel.ts";
import {movePhotoToAlbum, unfilePhoto} from "../../../../api/PhotoMoveAlbum.ts";

export default function MovePhotoModal(disclosure : Disclosure) {

  const [darkMode] = useDarkMode();
  const [selectedPhotos, setSelectedPhotos] = useSelectedPhotos();
  const [selectedAlbum, setSelectedAlbum] = useSelectedAlbum();
  const [albums] = useAlbums();

  const {isOpen, onOpenChange} = disclosure;
  const [modalSelectedAlbum, setModalSelectedAlbum] = useState<Album | null>(null);

  // Event handler for move photo button
  const onMovePhotos = () => {

    const selectedPhotoIds = selectedPhotos.map((photo) => photo.photoId)

    // On Success - Display toast + update frontend
    const onSuccess = (message: string) => {
      addToast({
        title: "Success",
        description: message,
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });

      // Update frontend
      selectedAlbum!.photos = selectedAlbum!.photos!.filter((p) => {
        return !selectedPhotoIds.includes(p.photoId);
      })

      setSelectedAlbum({...selectedAlbum!});

      modalSelectedAlbum!.photos = null;
      setSelectedPhotos([])

    }

    // On Error - Display error
    const onError = (code: number, message: string) => {
      addToast({
        title: "Error",
        description: message + " (Code: " + code + ")",
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      })
    }

    // Move album (or unfile if album id is -1)
    if (modalSelectedAlbum!.albumId === -1) {
      unfilePhoto(selectedPhotoIds, (code) => {
        onError(code, "Failed to unfile photos");
      }).then(() => {
        onSuccess(`Successfully unfiled ${selectedPhotos.length} photos`);
      });
    }
    else {
      movePhotoToAlbum(modalSelectedAlbum!.albumId, selectedPhotoIds, (code) => {
        onError(code, "Failed to move photos");
      }).then(() => {
        onSuccess(`Successfully moved ${selectedPhotos.length} photos to album ${modalSelectedAlbum?.albumName ?? "Unknown"} (ID: ${modalSelectedAlbum?.albumId})`);
      });
    }

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
          setModalSelectedAlbum(null);
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
                        value={modalSelectedAlbum?.albumName ?? ""}
                        type="text"
                        placeholder="Select Album"
                        size="md"
                        labelPlacement="inside"
                      />
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Dynamic Actions" items={albums}>
                    {(album) => (
                      <DropdownItem key={album.albumId} onPress={() => {setModalSelectedAlbum(album);}}>
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
                <Button color="primary" onPress={() => {onMovePhotos(); onClose();}} isDisabled={modalSelectedAlbum == null}>
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