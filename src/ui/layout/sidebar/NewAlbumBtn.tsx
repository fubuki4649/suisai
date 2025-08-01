import {addToast, Button, cn, Input, Popover, PopoverContent, PopoverTrigger, Spacer} from "@heroui/react";
import {PlusIcon} from "@heroicons/react/20/solid";
import React, {useState} from "react";
import {useAlbums, useDarkMode} from "../../../models/GlobalContext.tsx";
import {createAlbum, getAlbums} from "../../../api/Album.ts";
import {Album} from "../../../models/model.ts";

function NewAlbumBtn() {

  const [darkMode] = useDarkMode();
  const [, setAlbums] = useAlbums();
  const [newAlbumName, setNewAlbumName] = useState("");
  const [popoverIsOpen, setPopoverIsOpen] = useState(false);

  // Event handler for create button
  const onCreateButtonPress = () => {
    setPopoverIsOpen(false);
    createAlbum(newAlbumName, (code) => {
      addToast({
        title: "Error",
        description: "Failed to create album with code " + code,
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      })
    }).then(() => {
      addToast({
        title: "Success",
        description: "Successfully created album " + newAlbumName + "!",
        color: "success",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
      getAlbums().then((albums: Album[]) => {
        console.log(albums);
        setAlbums(albums);
      });
    })
  }

  return (
    <div className="h-fit">
      <Popover
        className={cn(darkMode && "dark text-foreground")}
        placement="right"
        showArrow={true}
        backdrop="blur"
        isOpen={popoverIsOpen}
        onOpenChange={(isOpen: boolean) => {
          setPopoverIsOpen(isOpen)
          setNewAlbumName("")
        }}
        onClose={() => {setPopoverIsOpen(false)}}
      >
        <PopoverTrigger>
          <Button color="default" variant="ghost" endContent={<PlusIcon className={"size-6"}/>}>
            <Spacer className="w-0"/>
            <p className="font-semibold">Add Album</p>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2">
            <div className="flex flex-row justify-between">
              <div className="text-small font-bold">New Album</div>
              <Button
                isDisabled={newAlbumName.trim().length == 0}
                onPress={onCreateButtonPress}
                className="mb-[-22px]"
                color="primary"
                size="sm"
              >
                {newAlbumName.trim().length == 0 ? "Name Cannot Be Blank" : "Create"}
              </Button>
            </div>
            <Input
              label="Please choose a name"
              value={newAlbumName}
              onValueChange={setNewAlbumName}
              type="text" size="sm"
              placeholder="Album Name"
              color={cn(darkMode ? "default" : "primary") as "primary" | "default"}
              labelPlacement="outside"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default NewAlbumBtn