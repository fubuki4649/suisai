import {Button, cn, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer,} from "@heroui/react";
import {ModalProps} from "./ViewModel.ts";
import React, {useState} from "react";
import {useDarkMode} from "../../../models/GlobalContext.tsx";

export function DeleteAlbumModal(props: ModalProps) {

  const [darkMode] = useDarkMode();

  const {isOpen, onOpen, onOpenChange} = props.disclosure;
  const [confirmText, setConfirmText] = useState("");

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
                <Button color="primary" onPress={onClose} isDisabled={confirmText != props.album.albumId.toString()}>
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
