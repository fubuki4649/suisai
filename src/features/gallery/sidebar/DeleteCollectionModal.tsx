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
import {useCollections, useDarkMode, useSelectedCollection} from "../../../context/GalleryContext.tsx";
import {deleteCollection, getCollections} from "../../../api/collections.ts";
import {Collection} from "../../../types/models.ts";
import {Disclosure} from "../../../types/disclosure.ts";

export interface DeleteCollectionModalProps {
  disclosure: Disclosure;
  collection: Collection;
}

export function DeleteCollectionModal({disclosure, collection}: DeleteCollectionModalProps) {
  const [darkMode] = useDarkMode();
  const [, setCollections] = useCollections();
  const [selectedCollection, setSelectedCollection] = useSelectedCollection();

  const {isOpen, onOpenChange} = disclosure;
  const [confirmText, setConfirmText] = useState("");

  // Event handler for delete button
  const onDeleteCollection = () => {
    deleteCollection(collection.id, (code) => {
      addToast({
        title: "Error",
        description: "Failed to delete collection with code " + code,
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    }).then(() => {
      addToast({
        title: "Success",
        description: "Collection ID " + collection.id + " successfully deleted!",
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
      getCollections().then((collections: Collection[]) => {
        setCollections(collections);
      });
      if (selectedCollection?.id === collection.id) {
        setSelectedCollection(null);
      }
    });
  };

  return (
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
            <ModalHeader className="flex flex-col gap-1">Delete Collection</ModalHeader>
            <ModalBody>
              <p>
                You are about to DELETE the following collection. This action cannot be undone!
              </p>

              <Spacer className="h-1"/>

              <p>
                Current Name : {collection.label}
              </p>
              <p>
                Collection ID : {collection.id}
              </p>

              <Spacer className="h-1"/>

              <Input
                label="Please enter the collection ID to confirm deletion"
                value={confirmText}
                onValueChange={setConfirmText}
                type="text" size="sm"
                placeholder="Collection ID"
                labelPlacement="outside"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={() => {onDeleteCollection(); onClose();}}
                isDisabled={confirmText !== collection.id}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default DeleteCollectionModal;
