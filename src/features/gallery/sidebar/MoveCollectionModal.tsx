import React, {useEffect, useState} from "react";
import {
  Button,
  Modal,
  toast,
} from "@heroui/react";
import {useCollections} from "../../../context/GalleryContext.tsx";
import {getCollections, getCollectionsFlat} from "../../../api/collections.ts";
import {Collection} from "../../../types/models.ts";
import {reassignCollection, unfileCollection} from "../../../api/management.ts";
import {Disclosure} from "../../../types/disclosure.ts";
import CollectionPicker from "../components/CollectionPicker.tsx";

export interface MoveCollectionModalProps {
  disclosure: Disclosure;
  collection: Collection;
}

function MoveCollectionModal({disclosure, collection}: MoveCollectionModalProps) {
  const [collectionList, setCollectionList] = useState<Collection[]>([]);
  const [, setCollections] = useCollections();

  const {isOpen} = disclosure;
  const [modalSelectedCollection, setModalSelectedCollection] = useState<Collection | null>(null);

  useEffect(() => {
    if (isOpen) getCollectionsFlat().then((r) => setCollectionList(r.filter((c) => c.id !== collection.id)));
  }, [isOpen, collection.id]);

  const onMoveCollection = async () => {
    if (!modalSelectedCollection) return;
    const onError = (code: number, msg: string) =>
      toast.danger("Error", {description: `${msg} (Code: ${code})`});
    try {
      if (modalSelectedCollection.id === "-1") {
        await unfileCollection([collection.id], (code) => onError(code, "Failed to move collection"));
        toast.success("Success", {description: `Successfully moved ${collection.label} to root`});
      } else {
        await reassignCollection(modalSelectedCollection.id, [collection.id], (code) => onError(code, "Failed to move collection"));
        toast.success("Success", {description: `Successfully moved ${collection.label} to ${modalSelectedCollection.label}`});
      }
      setCollections(await getCollections());
    } catch { /* HTTP errors reported above; network errors surfaced by ServerHealth */ }
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
                  <Modal.Heading>Move Collection</Modal.Heading>
                </Modal.Header>
                <Modal.Body className="space-y-4">
                  <p className="text-sm text-foreground">
                    Moving collection <span className="font-semibold text-accent">"{collection.label}"</span> to the following collection:
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
                    onPress={() => { onMoveCollection(); setModalSelectedCollection(null); close(); }}
                    isDisabled={modalSelectedCollection == null}
                  >
                    Move Collection
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

export default MoveCollectionModal;
