import {useCollections, useDarkMode, useSelectedCollection, useSelectedAssets} from "../../../../components/GlobalContext.tsx";
import React, {useEffect, useState} from "react";
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
import {Collection} from "../../../../api/models.ts";
import {Disclosure} from "../../../../components/modal-disclosure.ts";
import {reassignAsset, unfileAsset} from "../../../../api/endpoints/management.ts";
import {getCollectionsFlat} from "../../../../api/endpoints/collection.ts";
import {findCollectionByID} from "../../../../components/helpers.ts";

export default function MovePhotoModal(disclosure : Disclosure) {
  const [darkMode] = useDarkMode();
  const [selectedAssets, setSelectedAssets] = useSelectedAssets();
  const [selectedCollection, setSelectedCollection] = useSelectedCollection();
  const [collections] = useCollections();
  const [collectionList, setCollectionList] = useState<Collection[]>([]);

  const {isOpen, onOpenChange} = disclosure;
  const [modalSelectedCollection, setModalSelectedCollection] = useState<Collection | null>(null);

  // Fetch collection list
  useEffect(() => {
    if (isOpen) {
      getCollectionsFlat().then((result) => {
        setCollectionList(result);
      });
    }
  }, [isOpen]);

  // Event handler for move asset button
  const onMoveAssets = () => {
    const selectedAssetIds = selectedAssets.map((asset) => asset.id);

    // On Success - Display toast + update frontend
    const onSuccess = (message: string) => {
      addToast({
        title: "Success",
        description: message,
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });

      // Remove assets from the frontend
      if (selectedCollection && selectedCollection.assets) {
        selectedCollection.assets = selectedCollection.assets.filter((a) => {
          return !selectedAssetIds.includes(a.id);
        });
        setSelectedCollection({...selectedCollection});
      }

      // Clear selected assets
      setSelectedAssets([]);

      // Mark the asset list in the destination collection as dirty so that it gets reloaded
      const destCollection = findCollectionByID(modalSelectedCollection!.id, collections);
      if (destCollection) destCollection.assets = null;
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

    // Move asset (or unfile if collection id is "-1")
    if (modalSelectedCollection!.id === "-1") {
      unfileAsset(selectedAssetIds, (code) => {
        onError(code, "Failed to unfile assets");
      }).then(() => {
        onSuccess(`Successfully unfiled ${selectedAssets.length} assets`);
      });
    } else {
      reassignAsset(modalSelectedCollection!.id, selectedAssetIds, (code) => {
        onError(code, "Failed to move assets");
      }).then(() => {
        onSuccess(`Successfully moved ${selectedAssets.length} assets to collection ${modalSelectedCollection?.label ?? "Unknown"} (ID: ${modalSelectedCollection?.id})`);
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
            <ModalHeader className="flex flex-col gap-1">Move Assets</ModalHeader>
            <ModalBody>
              <p>
                Moving {selectedAssets.length} {selectedAssets.length === 1 ? "asset" : "assets"} to the following collection
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
              <Button color="primary" onPress={() => {onMoveAssets(); onClose();}} isDisabled={modalSelectedCollection == null}>
                {selectedAssets.length === 1 ? "Move Asset" : "Move Assets"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}