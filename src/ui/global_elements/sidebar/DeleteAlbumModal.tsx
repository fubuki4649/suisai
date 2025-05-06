import {
  addToast,
  Button,
  cn,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
} from "@heroui/react";
import {ModalProps} from "./ViewModel.ts";
import React, {useState} from "react";
import {useAlbums, useDarkMode} from "../../../models/GlobalContext.tsx";
import {deleteAlbum, getAlbums} from "../../../api/Album.ts";
import {Album} from "../../../models/model.ts";

export function DeleteAlbumModal(props: ModalProps) {

  const [darkMode] = useDarkMode();
  const [, setAlbums] = useAlbums();

  const {isOpen, onOpen, onOpenChange} = props.disclosure;
  const [confirmText, setConfirmText] = useState("");

  // Event handler for rename button
  const onDeleteAlbum = () => {
    deleteAlbum(props.album.albumId, (code) => {
      addToast({
        title: "Error",
        description: "Failed to delete album with code " + code,
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      })
    }).then(() => {
      addToast({
        title: "Success",
        description: "Album ID " + props.album.albumId + " successfully deleted!",
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
      getAlbums().then((albums: Album[]) => {
        console.log(albums);
        setAlbums(albums);
      });
    })
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
          setConfirmText("");
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete Album</ModalHeader>
              <ModalBody>

                <p>
                  You are about to DELETE the following album. This action cannot be undone!
                </p>

                <Spacer className="h-1"/>

                <p>
                  Current Name : {props.album.albumName}
                </p>
                <p>
                  Album ID : {props.album.albumId}
                </p>

                <Spacer className="h-1"/>

                <Input
                  label="Please enter the album ID to confirm deletion"
                  value={confirmText}
                  onValueChange={setConfirmText}
                  type="text" size="sm"
                  placeholder="Album ID"
                  labelPlacement="outside"
                />

              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={() => {onDeleteAlbum(); onClose();}} isDisabled={confirmText != props.album.albumId.toString()}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeleteAlbumModal;
