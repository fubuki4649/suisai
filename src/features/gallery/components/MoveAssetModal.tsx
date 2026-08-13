import {useCollections, useDarkMode, useSelectedCollection, useSelectedAssets} from "../../../context/GalleryContext.tsx";
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
import {Collection} from "../../../types/models.ts";
import {Disclosure} from "../../../types/disclosure.ts";
import {reassignAsset, unfileAsset} from "../../../api/management.ts";
import {getCollectionsFlat} from "../../../api/collections.ts";
import {findCollectionByID} from "../../../utils/tree.ts";

export function MoveAssetModal(disclosure: Disclosure) {
  const [darkMode] = useDarkMode();
  const [selectedAssets, setSelectedAssets] = useSelectedAssets();
  const [selectedCollection, setSelectedCollection] = useSelectedCollection();
  const [collections] = useCollections();
  const [collectionList, setCollectionList] = useState<Collection[]>([]);

  const {isOpen, onOpenChange} = disclosure;
  const [modalSelectedCollection, setModalSelectedCollection] = useState<Collection | null>(null);

  useEffect(() => {
    if (isOpen) {
      getCollectionsFlat().then((result) => {
        setCollectionList(result);
      });
    }
  }, [isOpen]);

  const onMoveAssets = () => {
    const selectedAssetIds = selectedAssets.map((asset) => asset.id);

    const onSuccess = (message: string) => {
      addToast({
        title: "Success",
        description: message,
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });

      if (selectedCollection && selectedCollection.assets) {
        selectedCollection.assets = selectedCollection.assets.filter((a) => {
          return !selectedAssetIds.includes(a.id);
        });
        setSelectedCollection({...selectedCollection});
      }

      setSelectedAssets([]);

      const destCollection = findCollectionByID(modalSelectedCollection!.id, collections);
      if (destCollection) destCollection.assets = null;
    };

    const onError = (code: number, message: string) => {
      addToast({
        title: "Error",
        description: message + " (Code: " + code + ")",
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    };

    if (modalSelectedCollection!.id === "-1") {
      unfileAsset(selectedAssetIds, (code) => {
        onError(code, "Failed to unfile components");
      }).then(() => {
        onSuccess(`Successfully unfiled ${selectedAssets.length} assets`);
      });
    } else {
      reassignAsset(modalSelectedCollection!.id, selectedAssetIds, (code) => {
        onError(code, "Failed to move components");
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

export default MoveAssetModal;
