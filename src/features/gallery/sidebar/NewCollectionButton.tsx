import React, {useState} from "react";
import {Button, Input, Label, Popover, TextField, toast,} from "@heroui/react";
import {Icon} from "@iconify/react";
import {useCollections} from "../../../context/GalleryContext.tsx";
import {createCollection, getCollections} from "../../../api/collections.ts";
import BackdropPortal from "../../../components/BackdropPortal.tsx";

function NewCollectionButton() {
  const [, setCollections] = useCollections();
  const [newCollectionName, setNewCollectionName] = useState("");
  const [popoverIsOpen, setPopoverIsOpen] = useState(false);

  // Event handler for create button
  const onCreateButtonPress = async () => {
    setPopoverIsOpen(false);
    try {
      await createCollection(newCollectionName, null, (code) =>
        toast.danger("Error", {description: "Failed to create collection with code " + code})
      );
      toast.success("Success", {description: `Successfully created collection "${newCollectionName}"!`});
      setNewCollectionName("");
      setCollections(await getCollections());
    } catch { /* HTTP errors reported above; network errors surfaced by ServerHealth */ }
  };

  return (
    <div className="h-fit w-full">
      {popoverIsOpen && <BackdropPortal onDismiss={() => { setPopoverIsOpen(false); setNewCollectionName(""); }} />}

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
