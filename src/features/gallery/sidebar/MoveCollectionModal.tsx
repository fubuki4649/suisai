import React, {useEffect, useState} from "react";
import {
  Button,
  Label,
  ListBox,
  Modal,
  Select,
  toast,
} from "@heroui/react";
import {useCollections} from "../../../context/GalleryContext.tsx";
import {getCollections, getCollectionsFlat} from "../../../api/collections.ts";
import {Collection} from "../../../types/models.ts";
import {reassignCollection, unfileCollection} from "../../../api/management.ts";
import {Disclosure} from "../../../types/disclosure.ts";

export interface MoveCollectionModalProps {
  disclosure: Disclosure;
  collection: Collection;
}

export function MoveCollectionModal({disclosure, collection}: MoveCollectionModalProps) {
  const [collectionList, setCollectionList] = useState<Collection[]>([]);
  const [, setCollections] = useCollections();

  const {isOpen} = disclosure;
  const [modalSelectedCollection, setModalSelectedCollection] = useState<Collection | null>(null);

  useEffect(() => {
    if (isOpen) {
      getCollectionsFlat().then((result) => {
        setCollectionList(result.filter((c) => c.id !== collection.id));
      });
    }
  }, [isOpen, collection.id]);

  const onMoveCollection = () => {
    if (!modalSelectedCollection) return;

    const onSuccess = (message: string) => {
      toast.success("Success", {
        description: message,
      });

      getCollections().then((collections: Collection[]) => {
        setCollections(collections);
      });
    };

    const onError = (code: number, message: string) => {
      toast.danger("Error", {
        description: message + " (Code: " + code + ")",
      });
    };

    if (modalSelectedCollection.id === "-1") {
      unfileCollection([collection.id], (code) => {
        onError(code, "Failed to move collection");
      }).then(() => {
        onSuccess(`Successfully moved ${collection.label} to root`);
      });
    } else {
      reassignCollection(modalSelectedCollection.id, [collection.id], (code) => {
        onError(code, "Failed to move collection");
      }).then(() => {
        onSuccess(`Successfully moved ${collection.label} to ${modalSelectedCollection.label}`);
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
                  <Modal.Heading>Move Collection</Modal.Heading>
                </Modal.Header>
                <Modal.Body className="space-y-4">
                  <p className="text-sm text-foreground">
                    Moving collection <span className="font-semibold text-accent">"{collection.label}"</span> to the following collection:
                  </p>

                  <Select
                    placeholder="Select Destination Collection"
                    value={modalSelectedCollection?.id ?? null}
                    onChange={(key) => {
                      const selected = collectionList.find((c) => c.id === key) ?? null;
                      setModalSelectedCollection(selected);
                    }}
                  >
                    <Label className="text-sm font-medium text-foreground">Destination Collection</Label>
                    <Select.Trigger className="w-full">
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover className="max-h-60 overflow-y-auto">
                      <ListBox>
                        {collectionList.map((item) => (
                          <ListBox.Item key={item.id} id={item.id} textValue={`${item.label} (${item.id})`}>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{item.label}</span>
                              <span className="text-xs text-muted">ID: {item.id}</span>
                            </div>
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
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
