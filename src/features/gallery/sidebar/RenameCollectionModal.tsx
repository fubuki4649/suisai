import React, {useState} from "react";
import {
  Button,
  Input,
  Label,
  Modal,
  TextField,
  toast,
} from "@heroui/react";
import {useCollections} from "../../../context/GalleryContext.tsx";
import {getCollections, renameCollection} from "../../../api/collections.ts";
import {Collection} from "../../../types/models.ts";
import {Disclosure} from "../../../types/disclosure.ts";

export interface RenameCollectionModalProps {
  disclosure: Disclosure;
  collection: Collection;
}

export function RenameCollectionModal({disclosure, collection}: RenameCollectionModalProps) {
  const [, setCollections] = useCollections();
  const [newCollectionName, setNewCollectionName] = useState("");

  const onRenameCollection = () => {
    renameCollection(collection.id, newCollectionName, (code) => {
      toast.danger("Error", {
        description: "Failed to rename collection with code " + code,
      });
    }).then(() => {
      toast.success("Success", {
        description: `Collection "${collection.label}" successfully renamed to "${newCollectionName}"!`,
      });
      getCollections().then((collections: Collection[]) => {
        setCollections(collections);
      });
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
                  <Modal.Heading>Rename Collection</Modal.Heading>
                </Modal.Header>
                <Modal.Body className="space-y-3">
                  <p className="text-sm text-foreground">
                    You are about to modify the following collection:
                  </p>

                  <div className="rounded-xl bg-default-100 p-3 text-xs space-y-1">
                    <p><span className="text-muted">Current Name:</span> <span className="font-medium">{collection.label}</span></p>
                    <p><span className="text-muted">Collection ID:</span> <span className="font-mono">{collection.id}</span></p>
                  </div>

                  <TextField
                    name="new-collection-name"
                    value={newCollectionName}
                    onChange={setNewCollectionName}
                  >
                    <Label className="text-xs font-medium text-foreground">Please choose a new name</Label>
                    <Input
                      placeholder="New Collection Name"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newCollectionName.trim().length > 0) {
                          onRenameCollection();
                          setNewCollectionName("");
                          close();
                        }
                      }}
                    />
                  </TextField>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="tertiary" onPress={() => { setNewCollectionName(""); close(); }}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onPress={() => { onRenameCollection(); setNewCollectionName(""); close(); }}
                    isDisabled={newCollectionName.trim().length === 0}
                  >
                    Rename
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

export default RenameCollectionModal;
