import React from "react";
import {Button, Modal, toast} from "@heroui/react";
import {useCollections, useSelectedCollection} from "../../../context/GalleryContext.tsx";
import {deleteCollection, getCollections, queryCollection} from "../../../api/collections.ts";
import {Collection} from "../../../types/models.ts";
import {Disclosure} from "../../../types/disclosure.ts";

export interface DeleteCollectionModalProps {
  disclosure: Disclosure;
  collection: Collection;
}

function DeleteCollectionModal({disclosure, collection}: DeleteCollectionModalProps) {
  const [, setCollections] = useCollections();
  const [selectedCollection, setSelectedCollection] = useSelectedCollection();

  const onDeleteCollection = async () => {
    try {
      await deleteCollection(collection.id, (code) =>
        toast.danger("Error", {description: "Failed to delete collection with code " + code})
      );
      const updated = await getCollections();
      setCollections(updated);
      if (selectedCollection?.id === collection.id) {
        const unfiled = updated.find((c) => c.id === "-1") ?? updated[0];
        if (unfiled) {
          setSelectedCollection({...unfiled, assets: await queryCollection(unfiled.id)});
        } else {
          setSelectedCollection(null);
        }
      }
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
                  <Modal.Heading>Delete Collection</Modal.Heading>
                </Modal.Header>
                <Modal.Body className="space-y-3">
                  <p className="text-sm text-foreground">
                    You are about to <span className="font-semibold text-danger">DELETE</span> the collection <span className="font-semibold text-accent">{collection.label}</span>. This action cannot be undone!
                  </p>

                  <div className="rounded-xl bg-default-100 p-3 text-s space-y-1">
                    <p><span className="text-muted">Current Name:</span> <span className="font-medium">{collection.label}</span></p>
                    <p><span className="text-muted">Collection ID:</span> <span className="font-mono">{collection.id}</span></p>
                  </div>

                </Modal.Body>
                <Modal.Footer>
                  <Button variant="tertiary" onPress={() => { close(); }}>
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onPress={() => { onDeleteCollection(); close(); }}
                  >
                    Delete Collection
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

export default DeleteCollectionModal;
