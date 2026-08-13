import {Button, Card, CardBody, CardHeader, cn, Tooltip, useDisclosure} from "@heroui/react";
import {CheckCircleIcon, NoSymbolIcon, TrashIcon, TruckIcon} from "@heroicons/react/24/outline";
import React from "react";
import {useDarkMode, useSelectedCollection, useSelectedAssets} from "../../../context/GalleryContext.tsx";
import MoveAssetModal from "./MoveAssetModal.tsx";
import DeleteAssetModal from "./DeleteAssetModal.tsx";
import {Disclosure} from "../../../types/disclosure.ts";

export interface AssetActionsCardProps {
  vertical?: boolean;
}

export function AssetActionsCard({ vertical = false }: AssetActionsCardProps) {
  const [darkMode] = useDarkMode();
  const [selectedCollection] = useSelectedCollection();
  const [selectedAssets, setSelectedAssets] = useSelectedAssets();

  const selectAll = () => {
    setSelectedAssets(selectedCollection?.assets ?? []);
  };

  const deselectAll = () => {
    setSelectedAssets([]);
  };

  const moveAssetDisclosure: Disclosure = useDisclosure();
  const deleteAssetDisclosure: Disclosure = useDisclosure();

  return (
    <>
      <MoveAssetModal {...moveAssetDisclosure}/>
      <DeleteAssetModal {...deleteAssetDisclosure}/>

      <Card shadow="md" className="h-fit min-w-fit m-6 mt-auto select-none">
        <CardHeader className="p-4">
          <div className="flex flex-row justify-center w-full">
            {!vertical && <h4 className="font-bold text-large mr-auto">Selected Assets</h4>}
            <p className="text-default-600 opacity-90">({selectedAssets.length})</p>
          </div>
        </CardHeader>
        <CardBody className="p-4 !pt-0">
          <div className={cn(vertical ? "flex-col" : "flex-row", "flex w-full gap-4 justify-evenly")}>
            <Tooltip className={cn(darkMode && "dark text-foreground")} content="Select All">
              <Button isIconOnly className="p-1.5" aria-label="Select All" color="secondary" variant="light" onPress={selectAll}><CheckCircleIcon/></Button>
            </Tooltip>
            <Tooltip className={cn(darkMode && "dark text-foreground")} content="Deselect All">
              <Button isIconOnly className="p-1.5" aria-label="Deselect All" color="secondary" variant="light" onPress={deselectAll}><NoSymbolIcon/></Button>
            </Tooltip>
            <Tooltip className={cn(darkMode && "dark text-foreground")} content="Move To Collection">
              <Button isIconOnly className="p-1.5" aria-label="Move To Collection" color="success" variant="flat" onPress={moveAssetDisclosure.onOpen}><TruckIcon/></Button>
            </Tooltip>
            <Tooltip className={cn(darkMode && "dark text-foreground")} content="Delete Assets" color="danger">
              <Button isIconOnly className="p-2" aria-label="Delete" color="danger" variant="shadow" onPress={deleteAssetDisclosure.onOpen}><TrashIcon/></Button>
            </Tooltip>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default AssetActionsCard;
