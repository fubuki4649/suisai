import {Card, cn, Image, PressEvent} from "@heroui/react";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useSelectedCollection, useSelectedAssets} from "../../../../../components/GlobalContext.tsx";
import ModalZoomImage from "../../../../../components/ModalZoomImage.tsx";
import {Asset} from "../../../../../api/models.ts";
import {ImageCardProps} from "./props.ts";

function ImageCard(props: ImageCardProps) {
  const [selectedCollection] = useSelectedCollection();
  const [selectedAssets, setSelectedAssets] = useSelectedAssets();
  const selectedAssetsRef = useRef(selectedAssets);

  // For undoing double clicks
  const [prevSelectedAssets, setPrevSelectedAssets] = useState<Asset[]>([]);
  const [prevSelectedAssets2, setPrevSelectedAssets2] = useState<Asset[]>([]);

  const selectAssets = useCallback((newSelectedAssets: Asset[]) => {
    setPrevSelectedAssets2(prevSelectedAssets);
    setPrevSelectedAssets(selectedAssets);
    setSelectedAssets(newSelectedAssets);
  }, [prevSelectedAssets, selectedAssets, setSelectedAssets]);

  const undoSelectAssets = useCallback(() => {
    setSelectedAssets(prevSelectedAssets2);
  }, [prevSelectedAssets2, setSelectedAssets]);

  // Update ref on asset select/deselect
  useEffect(() => {
    selectedAssetsRef.current = selectedAssets;
  }, [selectedAssets]);

  // Handles thumbnail card selection: toggles the selected state for that card and updates the metadata panel
  const onCardSelect = (cardId: string, e: PressEvent) => {
    // Handle multi-select
    if (e.ctrlKey || e.metaKey) {
      // Perform a multi-deselect if the pressed card is already selected
      if (selectedAssetsRef.current.some((iter) => iter.id === cardId)) {
        selectAssets(selectedAssetsRef.current.filter((iter) => iter.id !== cardId));
      }
      // Else perform a multi-select
      else {
        const newlySelected = selectedCollection?.assets?.find((iter) => iter.id === cardId);
        selectAssets(newlySelected ? selectedAssetsRef.current.concat(newlySelected) : selectedAssetsRef.current);
      }
    }
    // Handle continuous multi-select
    else if (e.shiftKey) {
      // If nothing is selected, perform a normal select
      if (selectedAssetsRef.current.length === 0) {
        const newlySelectedAsset = selectedCollection?.assets?.find((iter) => iter.id === cardId);
        selectAssets(newlySelectedAsset ? [newlySelectedAsset] : []);
      }
      // Select all assets between the last selected and newly selected assets (by index)
      else {
        const lastSelectedIndex = selectedCollection?.assets?.findIndex(
          (iter) => iter.id === selectedAssetsRef.current[selectedAssetsRef.current.length - 1].id
        );
        const newlySelectedIndex = selectedCollection?.assets?.findIndex((iter) => iter.id === cardId);

        if (lastSelectedIndex !== undefined && lastSelectedIndex !== -1 && newlySelectedIndex !== undefined && newlySelectedIndex !== -1) {
          const slice = selectedCollection?.assets?.slice(
            Math.min(lastSelectedIndex, newlySelectedIndex),
            Math.max(lastSelectedIndex, newlySelectedIndex) + 1
          );
          selectAssets(slice ? selectedAssetsRef.current.concat(slice) : selectedAssetsRef.current);
        }
      }
    }
    // Handle normal select
    else {
      // Perform a single deselect if the pressed card is the only selected card
      if (selectedAssetsRef.current.some((asset) => asset.id === cardId) && selectedAssetsRef.current.length === 1) {
        selectAssets(selectedAssetsRef.current.filter((item) => item.id !== cardId));
      }
      // Else perform a single select
      else {
        const newlySelected = selectedCollection?.assets?.find((asset) => asset.id === cardId);
        selectAssets(newlySelected ? [newlySelected] : selectedAssetsRef.current);
      }
    }
  };

  return (
    <Card
      isPressable
      onPress={(e: PressEvent) => onCardSelect(props.id, e)}
      onDoubleClick={undoSelectAssets}
      shadow={cn(props.isSelected ? "lg" : "sm") as ("lg" | "sm")}
      className={cn(props.isSelected ? "border-1.5 border-primary-500" : "border-1 border-default-400 h-fit w-fit flex-shrink-0")}
    >
      {props.allowZoom ? (
        <ModalZoomImage
          className="rounded-none object-contain"
          alt={props.alt}
          src={props.previewUrl}
        />
      ) : (
        <Image
          className="rounded-none object-contain"
          alt={props.alt}
          src={props.previewUrl}
        />
      )}
    </Card>
  );
}

export default ImageCard;
