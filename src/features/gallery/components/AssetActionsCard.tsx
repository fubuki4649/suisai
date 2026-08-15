import {Button, Card, cn, Tooltip, useOverlayState} from "@heroui/react";
import {Icon} from "@iconify/react";
import React from "react";
import {useSelectedCollection, useSelectedAssets} from "../../../context/GalleryContext.tsx";
import MoveAssetModal from "./MoveAssetModal.tsx";
import DeleteAssetModal from "./DeleteAssetModal.tsx";

export interface AssetActionsCardProps {
  vertical?: boolean;
}

export function AssetActionsCard({ vertical = false }: AssetActionsCardProps) {
  const [selectedCollection] = useSelectedCollection();
  const [selectedAssets, setSelectedAssets] = useSelectedAssets();

  const selectAll = () => {
    setSelectedAssets(selectedCollection?.assets ?? []);
  };

  const deselectAll = () => {
    setSelectedAssets([]);
  };

  const moveAssetState = useOverlayState();
  const deleteAssetState = useOverlayState();

  return (
    <>
      <MoveAssetModal {...moveAssetState} />
      <DeleteAssetModal {...deleteAssetState} />

      <Card className="h-fit min-w-fit m-6 mt-auto select-none rounded-2xl bg-surface border border-separator shadow-md p-3.5">
        <Card.Header>
          <div className="flex flex-row items-center justify-center w-full">
            {!vertical && <Card.Title className="font-medium text-base mr-auto">Selected Assets</Card.Title>}
            <span className="text-sm text-muted">({selectedAssets.length})</span>
          </div>
        </Card.Header>
        <Card.Content className="pt-0!">
          <div className={cn(vertical ? "flex-col" : "flex-row", "flex w-full gap-2.5 justify-evenly")}>
            <Tooltip delay={200}>
              <Tooltip.Trigger>
                <Button isIconOnly size="sm" variant="tertiary" aria-label="Select All" onPress={selectAll}>
                  <Icon icon="gravity-ui:circle-check" className="w-5 h-5" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>Select All</p>
              </Tooltip.Content>
            </Tooltip>

            <Tooltip delay={200}>
              <Tooltip.Trigger>
                <Button isIconOnly size="sm" variant="tertiary" aria-label="Deselect All" onPress={deselectAll}>
                  <Icon icon="gravity-ui:circle-minus" className="w-5 h-5" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>Deselect All</p>
              </Tooltip.Content>
            </Tooltip>

            <Tooltip delay={200}>
              <Tooltip.Trigger>
                <Button isIconOnly size="sm" variant="secondary" aria-label="Move To Collection" onPress={moveAssetState.open}>
                  <Icon icon="gravity-ui:folder-arrow-right" className="w-5 h-5" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>Move To Collection</p>
              </Tooltip.Content>
            </Tooltip>

            <Tooltip delay={200}>
              <Tooltip.Trigger>
                <Button isIconOnly size="sm" variant="danger-soft" aria-label="Delete" onPress={deleteAssetState.open}>
                  <Icon icon="gravity-ui:trash-bin" className="w-5 h-5" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>Delete Assets</p>
              </Tooltip.Content>
            </Tooltip>
          </div>
        </Card.Content>
      </Card>
    </>
  );
}

export default AssetActionsCard;
