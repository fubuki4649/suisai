import {Button, Card, Chip, cn, Tooltip, useOverlayState} from "@heroui/react";
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

      <Card className={cn(vertical ? "h-fit min-w-fit m-3" : "h-fit w-68 m-5", "mt-auto select-none rounded-2xl bg-surface border border-separator shadow-lg p-3")}>
        <Card.Header className="pb-2">
          <div className={cn(vertical ? "justify-around" : "justify-between", "flex flex-row items-center w-full")}>
            {!vertical && <span className="font-semibold text-foreground">Selected Assets</span>}
            <Chip size="md" variant="soft" color="accent">
              {selectedAssets.length}
            </Chip>
          </div>
        </Card.Header>
        <Card.Content className="pt-0!">
          <div className={cn(vertical ? "flex-col" : "flex-row", "flex w-full justify-around gap-3.5")}>
            <Tooltip delay={200}>
              <Tooltip.Trigger>
                <Button isIconOnly size="lg" variant="tertiary" aria-label="Select All" onPress={selectAll}>
                  <Icon icon="gravity-ui:circle-check" className="w-5 h-5" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>Select All</p>
              </Tooltip.Content>
            </Tooltip>

            <Tooltip delay={200}>
              <Tooltip.Trigger>
                <Button isIconOnly size="lg" variant="tertiary" aria-label="Deselect All" onPress={deselectAll}>
                  <Icon icon="gravity-ui:circle-minus" className="w-5 h-5" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>Deselect All</p>
              </Tooltip.Content>
            </Tooltip>

            <Tooltip delay={200}>
              <Tooltip.Trigger>
                <Button isIconOnly size="lg" variant="secondary" aria-label="Move To Collection" onPress={moveAssetState.open}>
                  <Icon icon="gravity-ui:folder-arrow-right" className="w-5 h-5" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>Move To Collection</p>
              </Tooltip.Content>
            </Tooltip>

            <Tooltip delay={200}>
              <Tooltip.Trigger>
                <Button isIconOnly size="lg" variant="danger-soft" aria-label="Delete" onPress={deleteAssetState.open}>
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
