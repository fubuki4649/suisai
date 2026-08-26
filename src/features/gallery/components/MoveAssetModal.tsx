import {useCollections, useSelectedCollection, useSelectedAssets} from "../../../context/GalleryContext.tsx";
import React, {useEffect, useState} from "react";
import {
  Button,
  Modal,
  toast
} from "@heroui/react";
import {Collection} from "../../../types/models.ts";
import {Disclosure} from "../../../types/disclosure.ts";
import {reassignAsset, unfileAsset} from "../../../api/management.ts";
import {getCollectionsFlat} from "../../../api/collections.ts";
import {findCollectionByID} from "../../../utils/tree.ts";
import CollectionPicker from "./CollectionPicker.tsx";

function MoveAssetModal(disclosure: Disclosure) {
  const [selectedAssets, setSelectedAssets] = useSelectedAssets();
  const [selectedCollection, setSelectedCollection] = useSelectedCollection();
  const [collections] = useCollections();
  const [collectionList, setCollectionList] = useState<Collection[]>([]);

  const {isOpen} = disclosure;
  const [modalSelectedCollection, setModalSelectedCollection] = useState<Collection | null>(null);

  useEffect(() => {
    if (isOpen) {
      getCollectionsFlat().then((result) => {
        setCollectionList(result);
      });
    }
  }, [isOpen]);

  const onMoveAssets = () => {
    if (!modalSelectedCollection) return;
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

      const destCollection = findCollectionByID(modalSelectedCollection.id, collections);
      if (destCollection) destCollection.assets = null;
    };

    const onError = (code: number, message: string) => {
      toast.danger("Error", {
        description: message + " (Code: " + code + ")",
      });
    };

    if (modalSelectedCollection.id === "-1") {
      unfileAsset(selectedAssetIds, (code) => {
        onError(code, "Failed to unfile assets");
      }).then(() => {
        onSuccess(`Successfully unfiled ${selectedAssets.length} assets`);
      });
    } else {
      reassignAsset(modalSelectedCollection.id, selectedAssetIds, (code) => {
        onError(code, "Failed to move assets");
      }).then(() => {
        onSuccess(`Successfully moved ${selectedAssets.length} assets to collection ${modalSelectedCollection.label} (ID: ${modalSelectedCollection.id})`);
      });
    }
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
                  <Modal.Heading>Move Assets</Modal.Heading>
                </Modal.Header>
                <Modal.Body className="space-y-4">
                  <p className="text-sm text-foreground">
                    Moving {selectedAssets.length} {selectedAssets.length === 1 ? "asset" : "assets"} to the following collection:
                  </p>

                  <CollectionPicker
                    collections={collectionList}
                    value={modalSelectedCollection}
                    onChange={setModalSelectedCollection}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="tertiary" onPress={() => { setModalSelectedCollection(null); close(); }}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onPress={() => { onMoveAssets(); setModalSelectedCollection(null); close(); }}
                    isDisabled={modalSelectedCollection == null}
                  >
                    {selectedAssets.length === 1 ? "Move Asset" : "Move Assets"}
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

export default MoveAssetModal;
