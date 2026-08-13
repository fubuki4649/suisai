import {useDarkMode, useSelectedCollection, useSelectedAssets} from "../../../context/GalleryContext.tsx";
import React from "react";
import {addToast, Button, cn, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@heroui/react";
import {Disclosure} from "../../../types/disclosure.ts";
import {deleteAsset} from "../../../api/assets.ts";

export function DeleteAssetModal(disclosure: Disclosure) {
  const [darkMode] = useDarkMode();
  const [selectedAssets, setSelectedAssets] = useSelectedAssets();
  const [selectedCollection, setSelectedCollection] = useSelectedCollection();
  const {isOpen, onOpenChange} = disclosure;

  const onDeleteAssets = () => {
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

    deleteAsset(selectedAssetIds, (code) => {
      onError(code, "Failed to delete components");
    }).then(() => {
      onSuccess(`Successfully deleted ${selectedAssets.length} ${selectedAssets.length === 1 ? "asset" : "assets"}`);
    });
  };

  return (
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
            <ModalHeader className="flex flex-col gap-1">Delete Assets</ModalHeader>
            <ModalBody>
              <p>
                You are about to DELETE {selectedAssets.length} {selectedAssets.length === 1 ? "asset" : "assets"}. This action cannot be undone!
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={() => {onDeleteAssets(); onClose();}}>
                Confirm Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default DeleteAssetModal;
