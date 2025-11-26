import {useDarkMode, useSelectedAlbum, useSelectedPhotos} from "../../../../models/GlobalContext.tsx";
import React from "react";
import {addToast, Button, cn, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@heroui/react";
import {Disclosure} from "../../../../models/modal-disclosure.ts";
import {deletePhoto} from "../../../../api/endpoints/photo.ts";

export default function DeletePhotoModal(disclosure : Disclosure) {

  const [darkMode] = useDarkMode();
  const [selectedPhotos, setSelectedPhotos] = useSelectedPhotos();
  const [selectedAlbum, setSelectedAlbum] = useSelectedAlbum();
  const {isOpen, onOpenChange} = disclosure;

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

    // Delete photo
    deletePhoto(selectedPhotoIds, (code) => {
      onError(code, "Failed to delete photos");
    }).then(() => {
      onSuccess(`Successfully deleted ${selectedPhotos.length} photos`);
    });

  }

  return (
    <>
      <Modal
        className={cn(darkMode && "dark text-foreground")}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete Photos</ModalHeader>
              <ModalBody>

                <p>
                  You are about to DELETE {selectedPhotos.length} {selectedPhotos.length == 1 ? "photo" : "photos"}. This action cannot be undone!
                </p>

              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={() => {onMovePhotos(); onClose();}}>
                  Confirm Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}