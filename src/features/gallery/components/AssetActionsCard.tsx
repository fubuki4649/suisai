import {Button, Card, Chip, cn, Tooltip, useOverlayState} from "@heroui/react";
import {Icon} from "@iconify/react";
import React from "react";
import {useSelectedCollection, useSelectedAssets} from "../../../context/GalleryContext.tsx";
import MoveAssetModal from "./MoveAssetModal.tsx";
import DeleteAssetModal from "./DeleteAssetModal.tsx";

export interface AssetActionsCardProps {
  vertical?: boolean;
}

function AssetActionsCard({ vertical = false }: AssetActionsCardProps) {
  const [selectedCollection] = useSelectedCollection();
  const [selectedAssets, setSelectedAssets] = useSelectedAssets();

  const selectAll   = () => setSelectedAssets(selectedCollection?.assets ?? []);
  const deselectAll = () => setSelectedAssets([]);

  const moveAssetState = useOverlayState();
  const deleteAssetState = useOverlayState();

  const actions = [
    { label: "Select All", icon: "gravity-ui:circle-check", variant: "tertiary" as const, onPress: selectAll },
    { label: "Deselect All", icon: "gravity-ui:circle-minus", variant: "tertiary" as const, onPress: deselectAll },
    { label: "Move To Collection", icon: "gravity-ui:folder-arrow-right", variant: "secondary" as const, onPress: moveAssetState.open },
    { label: "Delete Assets", ariaLabel: "Delete", icon: "gravity-ui:trash-bin", variant: "danger-soft" as const, onPress: deleteAssetState.open },
  ];

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
            {actions.map(({ label, ariaLabel, icon, variant, onPress }) => (
              <Tooltip key={label} delay={200}>
                <Tooltip.Trigger>
                  <Button isIconOnly size="lg" variant={variant} aria-label={ariaLabel ?? label} onPress={onPress}>
                    <Icon icon={icon} className="w-5 h-5" />
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <p>{label}</p>
                </Tooltip.Content>
              </Tooltip>
            ))}
          </div>
        </Card.Content>
      </Card>
    </>
  );
}

export default AssetActionsCard;
