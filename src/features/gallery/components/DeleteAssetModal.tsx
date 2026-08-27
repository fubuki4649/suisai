import {useSelectedCollection, useSelectedAssets} from "../../../context/GalleryContext.tsx";
import React from "react";
import {Button, Modal, toast} from "@heroui/react";
import {Disclosure} from "../../../types/disclosure.ts";
import {deleteAsset} from "../../../api/assets.ts";

function DeleteAssetModal(disclosure: Disclosure) {
  const [selectedAssets, setSelectedAssets] = useSelectedAssets();
  const [selectedCollection, setSelectedCollection] = useSelectedCollection();

  const onDeleteAssets = () => {
    const selectedAssetIds = selectedAssets.map((asset) => asset.id);

    const onSuccess = (message: string) => {
      toast.success("Success", {
        description: message,
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
      toast.danger("Error", {
        description: message + " (Code: " + code + ")",
      });
    };

    deleteAsset(selectedAssetIds, (code) => {
      onError(code, "Failed to delete assets");
    }).then(() => {
      onSuccess(`Successfully deleted ${selectedAssets.length} ${selectedAssets.length === 1 ? "asset" : "assets"}`);
    });
  };

  return (
    <Modal state={disclosure}>
      <Modal.Backdrop variant="blur" isDismissable={false} isKeyboardDismissDisabled={true}>
        <Modal.Container size="sm">
          <Modal.Dialog>
            {({close}) => (
              <>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>Delete Assets</Modal.Heading>
                </Modal.Header>
                <Modal.Body>
                  <p className="text-sm text-foreground">
                    You are about to <span className="font-semibold text-danger">DELETE</span> {selectedAssets.length} {selectedAssets.length === 1 ? "asset" : "assets"}. This action cannot be undone!
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="tertiary" onPress={close}>
                    Cancel
                  </Button>
                  <Button variant="danger" onPress={() => { onDeleteAssets(); close(); }}>
                    Confirm Delete
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default DeleteAssetModal;
