import {addToast, Button, cn, Input, Popover, PopoverContent, PopoverTrigger, Spacer} from "@heroui/react";
import {PlusIcon} from "@heroicons/react/20/solid";
import React, {useState} from "react";
import {useCollections, useDarkMode} from "../../../components/GlobalContext.tsx";
import {createCollection, getCollections} from "../../../api/endpoints/album.ts";
import {Collection} from "../../../api/models.ts";

function NewAlbumBtn() {
  const [darkMode] = useDarkMode();
  const [, setCollections] = useCollections();
  const [newCollectionName, setNewCollectionName] = useState("");
  const [popoverIsOpen, setPopoverIsOpen] = useState(false);

  // Event handler for create button
  const onCreateButtonPress = () => {
    setPopoverIsOpen(false);
    createCollection(newCollectionName, null, (code) => {
      addToast({
        title: "Error",
        description: "Failed to create collection with code " + code,
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    }).then(() => {
      addToast({
        title: "Success",
        description: "Successfully created collection " + newCollectionName + "!",
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
      getCollections().then((collections: Collection[]) => {
        setCollections(collections);
      });
    });
  };

  return (
    <div className="h-fit w-full">
      <Popover
        className={cn(darkMode && "dark text-foreground")}
        placement="right"
        showArrow={true}
        backdrop="blur"
        isOpen={popoverIsOpen}
        onOpenChange={(isOpen: boolean) => {
          setPopoverIsOpen(isOpen);
          setNewCollectionName("");
        }}
        onClose={() => {setPopoverIsOpen(false);}}
      >
        <PopoverTrigger>
          <Button fullWidth className="text-medium" color="default" variant="ghost" endContent={<PlusIcon className={"size-6"}/>}>
            <Spacer className="w-0"/>
            <p className="font-semibold">Add Collection</p>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2 min-w-80">
            <div className="flex flex-row justify-between">
              <div className="text-small font-bold">New Collection</div>
              <Button
                isDisabled={newCollectionName.trim().length === 0}
                onPress={onCreateButtonPress}
                className="mb-[-22px]"
                color="primary"
                size="sm"
              >
                {newCollectionName.trim().length === 0 ? "Name Cannot Be Blank" : "Create"}
              </Button>
            </div>
            <Input
              label="Please choose a name"
              value={newCollectionName}
              onValueChange={setNewCollectionName}
              type="text" size="sm"
              placeholder="Collection Name"
              color={cn(darkMode ? "default" : "primary") as "primary" | "default"}
              labelPlacement="outside"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default NewAlbumBtn;