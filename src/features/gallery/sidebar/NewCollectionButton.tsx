import React, {useState} from "react";
import {createPortal} from "react-dom";
import {Button, Input, Label, Popover, TextField, toast,} from "@heroui/react";
import {Icon} from "@iconify/react";
import {useCollections} from "../../../context/GalleryContext.tsx";
import {createCollection, getCollections} from "../../../api/collections.ts";
import {Collection} from "../../../types/models.ts";

export function NewCollectionButton() {
  const [, setCollections] = useCollections();
  const [newCollectionName, setNewCollectionName] = useState("");
  const [popoverIsOpen, setPopoverIsOpen] = useState(false);

  // Event handler for create button
  const onCreateButtonPress = () => {
    setPopoverIsOpen(false);
    createCollection(newCollectionName, null, (code) => {
      toast.danger("Error", {
        description: "Failed to create collection with code " + code,
      });
    }).then(() => {
      toast.success("Success", {
        description: `Successfully created collection "${newCollectionName}"!`,
      });
      setNewCollectionName("");
      getCollections().then((collections: Collection[]) => {
        setCollections(collections);
      });
    });
  };

  return (
    <div className="h-fit w-full">
      {popoverIsOpen && typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-40 bg-backdrop backdrop-blur-sm transition-opacity duration-200"
            onClick={() => {
              setPopoverIsOpen(false);
              setNewCollectionName("");
            }}
          />,
          document.body
        )}

      <Popover
        isOpen={popoverIsOpen}
        onOpenChange={(isOpen: boolean) => {
          setPopoverIsOpen(isOpen);
          if (!isOpen) setNewCollectionName("");
        }}
      >
        <Button className="w-full justify-between font-medium rounded-xl px-3 py-2" variant="secondary">
          Add Collection
          <Icon icon="gravity-ui:plus" className="w-4 h-4" />
        </Button>
        <Popover.Content placement="right" offset={16} className="z-50">
          <Popover.Arrow className="fill-surface" />
          <Popover.Dialog className="p-4 w-80 space-y-3 bg-surface border border-separator rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <Popover.Heading className="font-semibold text-sm text-foreground">New Collection</Popover.Heading>
              <Button
                isDisabled={newCollectionName.trim().length === 0}
                onPress={onCreateButtonPress}
                variant="primary"
                size="sm"
              >
                Create
              </Button>
            </div>
            <TextField
              name="collection-name"
              value={newCollectionName}
              onChange={setNewCollectionName}
            >
              <Label className="text-xs text-muted">Please choose a name</Label>
              <Input
                placeholder="Collection Name"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newCollectionName.trim().length > 0) {
                    onCreateButtonPress();
                  }
                }}
              />
            </TextField>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </div>
  );
}

export default NewCollectionButton;
