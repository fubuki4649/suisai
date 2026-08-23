import React, {useState} from "react";
import {
  Button,
  Input,
  Label,
  Modal,
  TextField,
  toast,
} from "@heroui/react";
import {useCollections, useSelectedCollection} from "../../../context/GalleryContext.tsx";
import {deleteCollection, getCollections, queryCollection} from "../../../api/collections.ts";
import {Collection} from "../../../types/models.ts";
import {Disclosure} from "../../../types/disclosure.ts";

export interface DeleteCollectionModalProps {
  disclosure: Disclosure;
  collection: Collection;
}

export function DeleteCollectionModal({disclosure, collection}: DeleteCollectionModalProps) {
  const [, setCollections] = useCollections();
  const [selectedCollection, setSelectedCollection] = useSelectedCollection();
  const [confirmText, setConfirmText] = useState("");

  const onDeleteCollection = () => {
    deleteCollection(collection.id, (code) => {
      toast.danger("Error", {
        description: "Failed to delete collection with code " + code,
      });
    }).then(() => {
      if (selectedCollection?.id === collection.id) {
        getCollections().then((collections: Collection[]) => {
          setCollections(collections);
          const unfiled = collections.find((c) => c.id === "-1") ?? collections[0];
          if (unfiled) {
            queryCollection(unfiled.id).then((assets) => {
              unfiled.assets = assets;
              setSelectedCollection({...unfiled, assets});
            });
          } else {
            setSelectedCollection(null);
          }
        });
      } else {
        getCollections().then((collections: Collection[]) => {
          setCollections(collections);
        });
      }
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
                  <Modal.Heading>Delete Collection</Modal.Heading>
                </Modal.Header>
                <Modal.Body className="space-y-3">
                  <p className="text-sm text-foreground">
                    You are about to <span className="font-semibold text-danger">DELETE</span> the following collection. This action cannot be undone!
                  </p>

                  <div className="rounded-xl bg-default-100 p-3 text-xs space-y-1">
                    <p><span className="text-muted">Current Name:</span> <span className="font-medium">{collection.label}</span></p>
                    <p><span className="text-muted">Collection ID:</span> <span className="font-mono">{collection.id}</span></p>
                  </div>

                  <TextField
                    name="confirm-id"
                    value={confirmText}
                    onChange={setConfirmText}
                  >
                    <Label className="text-xs font-medium text-foreground">
                      Please enter the collection ID to confirm deletion
                    </Label>
                    <Input placeholder={collection.id} />
                  </TextField>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="tertiary" onPress={() => { setConfirmText(""); close(); }}>
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onPress={() => { onDeleteCollection(); setConfirmText(""); close(); }}
                    isDisabled={confirmText !== collection.id}
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
