import {Button, cn, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer,} from "@heroui/react";
import React, {useState} from "react";
import {useDarkMode} from "../../../models/GlobalContext.tsx";
import {ModalProps} from "./ViewModel.ts";

export function RenameAlbumModal(props: ModalProps) {

  const [darkMode] = useDarkMode();

  const {isOpen, onOpen, onOpenChange} = props.disclosure;
  const [newAlbumName, setNewAlbumName] = useState("");

  console.log(props.album);


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
                <Button color="primary" onPress={onClose} isDisabled={newAlbumName.trim().length == 0}>
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
