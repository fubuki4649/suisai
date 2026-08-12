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
import React, {useEffect, useState} from "react";
import {useCollections, useDarkMode} from "../../../../components/GlobalContext.tsx";
import {getCollections, getCollectionsFlat} from "../../../../api/endpoints/collection.ts";
import {Collection} from "../../../../api/models.ts";
import {CollectionModalProps} from "./props.ts";
import {reassignCollection, unfileCollection} from "../../../../api/endpoints/management.ts";

export function MoveAlbumModal({disclosure, collection}: CollectionModalProps) {
  const [darkMode] = useDarkMode();
  const [collectionList, setCollectionList] = useState<Collection[]>([]);
  const [, setCollections] = useCollections();

  const {isOpen, onOpenChange} = disclosure;
  const [modalSelectedCollection, setModalSelectedCollection] = useState<Collection | null>(null);

  // Fetch collection list
  useEffect(() => {
    if (isOpen) {
      getCollectionsFlat().then((result) => {
        // Remove the option to move the collection to itself
        setCollectionList(result.filter((c) => c.id !== collection.id));
      });
    }
  }, [isOpen, collection.id]);

  // Event handler for move collection button
  const onMoveCollection = () => {
    // On Success - Display toast + update frontend
    const onSuccess = (message: string) => {
      addToast({
        title: "Success",
        description: message,
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });

      // Update collection list on left rail
      getCollections().then((collections: Collection[]) => {
        setCollections(collections);
      });
    };

    // On Error - Display error
    const onError = (code: number, message: string) => {
      addToast({
        title: "Error",
        description: message + " (Code: " + code + ")",
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    };

    // Move collection (or unfile if collection id is "-1")
    if (modalSelectedCollection!.id === "-1") {
      unfileCollection([collection.id], (code) => {
        onError(code, "Failed to move collection");
      }).then(() => {
        onSuccess(`Successfully moved ${collection.label} to root`);
      });
    } else {
      reassignCollection(modalSelectedCollection!.id, [collection.id], (code) => {
        onError(code, "Failed to move collection");
      }).then(() => {
        onSuccess(`Successfully moved ${collection.label} to ${modalSelectedCollection?.label}`);
      });
    }
  };

  return (
    <Modal
      className={cn(darkMode && "dark text-foreground")}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      onOpenChange={() => {
        onOpenChange();
        setModalSelectedCollection(null);
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Move Collection</ModalHeader>
            <ModalBody>
              <p>
                Moving collection "{collection.label}" to the following collection
              </p>

              <Spacer className="h-1"/>

              <Dropdown className={cn(darkMode && "dark text-foreground")} placement="bottom-start">
                <DropdownTrigger>
                  <div>
                    <Input
                      isReadOnly
                      label="Destination Collection"
                      value={modalSelectedCollection?.label ?? ""}
                      type="text"
                      placeholder="Select Collection"
                      size="md"
                      labelPlacement="inside"
                    />
                  </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="Dynamic Actions" items={collectionList}>
                  {(item) => (
                    <DropdownItem key={item.id} onPress={() => {setModalSelectedCollection(item);}}>
                      {item.label} (ID: {item.id})
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={() => {onMoveCollection(); onClose();}} isDisabled={modalSelectedCollection == null}>
                Move Collection
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default MoveAlbumModal;
