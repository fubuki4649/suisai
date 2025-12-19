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
import React, {useState} from "react";
import {useAlbums, useDarkMode} from "../../../../components/GlobalContext.tsx";
import {getAlbums, renameAlbum} from "../../../../api/endpoints/album.ts";
import {Album} from "../../../../api/models.ts";
import {AlbumModalProps} from "./props.ts";

export function RenameAlbumModal(props: AlbumModalProps) {

  const [darkMode] = useDarkMode();
  const [, setAlbums] = useAlbums();

  const {isOpen, onOpen, onOpenChange} = props.disclosure;
  const [newAlbumName, setNewAlbumName] = useState("");

  // Event handler for rename button
  const onRenameAlbum = () => {
    renameAlbum(props.album.albumId, newAlbumName, (code) => {
      addToast({
        title: "Error",
        description: "Failed to rename album with code " + code,
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      })
    }).then(() => {
      addToast({
        title: "Success",
        description: "Album ID " + props.album.albumId + " successfully renamed to " + newAlbumName + "!",
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
      getAlbums().then((albums: Album[]) => {
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
          setNewAlbumName("");
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Rename Album</ModalHeader>
              <ModalBody>

                <p>
                  You are about to modify the following album. This action cannot be undone!
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
                  label="Please choose a new name"
                  value={newAlbumName}
                  onValueChange={setNewAlbumName}
                  type="text" size="sm"
                  placeholder="Album Name"
                  labelPlacement="outside"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={() => {onRenameAlbum(); onClose();}} isDisabled={newAlbumName.trim().length == 0}>
                  Rename
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default RenameAlbumModal;
