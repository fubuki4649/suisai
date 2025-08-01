import {Button, Card, CardBody, CardHeader, cn, Tooltip, useDisclosure} from "@heroui/react";
import {CheckCircleIcon, NoSymbolIcon, TrashIcon, TruckIcon} from "@heroicons/react/24/outline";
import React from "react";
import {useDarkMode, useSelectedAlbum, useSelectedPhotos} from "../../../models/GlobalContext.tsx";
import MovePhotoModal from "./action_card_modals/MovePhotoModal.tsx";
import {Disclosure} from "../../ViewModel.ts";
import DeletePhotoModal from "./action_card_modals/DeletePhotoModal.tsx";


export default function ActionsCard() {

  const [darkMode] = useDarkMode();
  const [selectedAlbum] = useSelectedAlbum();
  const [selectedPhotos, setSelectedPhotos] = useSelectedPhotos();

  const selectAll = () => {
    setSelectedPhotos(selectedAlbum?.photos ?? []);
  }

  const deselectAll = () => {
    setSelectedPhotos([]);
  }


  const movePhotoDisclosure: Disclosure = useDisclosure();
  const deletePhotoDisclosure: Disclosure = useDisclosure();

  return (
    <>
      <MovePhotoModal {...movePhotoDisclosure}/>
      <DeletePhotoModal {...deletePhotoDisclosure}/>

      <Card shadow="md" className="h-fit w-80 m-6 select-none">
        <CardHeader className="p-4 w-full flex-col">
          <div className="flex flex-row justify-between w-full">
            <h4 className="font-bold text-large">Selected Photos</h4>
            <p className="text-default-600 opacity-90">({selectedPhotos.length})</p>
          </div>
        </CardHeader>
        <CardBody className="p-4 !pt-0 flex-col">
          <div className="flex flex-row w-full gap-4 justify-evenly">
            <Tooltip className={cn(darkMode && "dark text-foreground")} content="Select All">
              <Button isIconOnly className="p-1.5" aria-label="Select All" color="secondary" variant="light" onPress={selectAll}><CheckCircleIcon/></Button>
            </Tooltip>
            <Tooltip className={cn(darkMode && "dark text-foreground")} content="Deselect All">
              <Button isIconOnly className="p-1.5" aria-label="Deselect All" color="secondary" variant="light" onPress={deselectAll}><NoSymbolIcon/></Button>
            </Tooltip>
            <Tooltip className={cn(darkMode && "dark text-foreground")} content="Move To Album">
              <Button isIconOnly className="p-1.5" aria-label="Move To Album" color="success" variant="flat" onPress={movePhotoDisclosure.onOpen}><TruckIcon/></Button>
            </Tooltip>
            <Tooltip className={cn(darkMode && "dark text-foreground")} content="Delete Images" color="danger">
              <Button isIconOnly className="p-2" aria-label="Delete" color="danger" variant="shadow" onPress={deletePhotoDisclosure.onOpen}><TrashIcon/></Button>
            </Tooltip>
          </div>
        </CardBody>
      </Card>
    </>
  )
}