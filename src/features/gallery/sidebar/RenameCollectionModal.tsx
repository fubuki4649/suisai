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
import {useCollections, useDarkMode} from "../../../context/GalleryContext.tsx";
import {getCollections, renameCollection} from "../../../api/collections.ts";
import {Collection} from "../../../types/models.ts";
import {Disclosure} from "../../../types/disclosure.ts";

export interface RenameCollectionModalProps {
  disclosure: Disclosure;
  collection: Collection;
}

export function RenameCollectionModal({disclosure, collection}: RenameCollectionModalProps) {
  const [darkMode] = useDarkMode();
  const [, setCollections] = useCollections();

  const {isOpen, onOpenChange} = disclosure;
  const [newCollectionName, setNewCollectionName] = useState("");

  const onRenameCollection = () => {
    renameCollection(collection.id, newCollectionName, (code) => {
      addToast({
        title: "Error",
        description: "Failed to rename collection with code " + code,
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    }).then(() => {
      addToast({
        title: "Success",
        description: "Collection ID " + collection.id + " successfully renamed to " + newCollectionName + "!",
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
      getCollections().then((collections: Collection[]) => {
        setCollections(collections);
      });
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
        setNewCollectionName("");
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Rename Collection</ModalHeader>
            <ModalBody>
              <p>
                You are about to modify the following collection. This action cannot be undone!
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
                label="Please choose a new name"
                value={newCollectionName}
                onValueChange={setNewCollectionName}
                type="text" size="sm"
                placeholder="Collection Name"
                labelPlacement="outside"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={() => {onRenameCollection(); onClose();}}
                isDisabled={newCollectionName.trim().length === 0}
              >
                Rename
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default RenameCollectionModal;
