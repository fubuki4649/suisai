import {Card, cn, Image, PressEvent} from "@heroui/react";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useSelectedCollection, useSelectedAssets} from "../../../context/GalleryContext.tsx";
import ModalZoomImage from "../../../components/ModalZoomImage.tsx";
import {Asset} from "../../../types/models.ts";

export interface AssetCardProps {
  id: string;
  alt: string;
  previewUrl: string;
  isSelected: boolean;
  allowZoom: boolean;
  isUniformFrame?: boolean;
}

export function AssetCard(props: AssetCardProps) {
  const [selectedCollection] = useSelectedCollection();
  const [selectedAssets, setSelectedAssets] = useSelectedAssets();
  const selectedAssetsRef = useRef(selectedAssets);
  const [isPortrait, setIsPortrait] = useState(false);

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

  useEffect(() => {
    selectedAssetsRef.current = selectedAssets;
  }, [selectedAssets]);

  const onCardSelect = (cardId: string, e: PressEvent) => {
    // Handle multi-select
    if (e.ctrlKey || e.metaKey) {
      if (selectedAssetsRef.current.some((iter) => iter.id === cardId)) {
        selectAssets(selectedAssetsRef.current.filter((iter) => iter.id !== cardId));
      } else {
        const newlySelected = selectedCollection?.assets?.find((iter) => iter.id === cardId);
        selectAssets(newlySelected ? selectedAssetsRef.current.concat(newlySelected) : selectedAssetsRef.current);
      }
    }
    // Handle continuous shift-select
    else if (e.shiftKey) {
      if (selectedAssetsRef.current.length === 0) {
        const newlySelectedAsset = selectedCollection?.assets?.find((iter) => iter.id === cardId);
        selectAssets(newlySelectedAsset ? [newlySelectedAsset] : []);
      } else {
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
    // Handle single select / toggle
    else {
      if (selectedAssetsRef.current.some((asset) => asset.id === cardId) && selectedAssetsRef.current.length === 1) {
        selectAssets(selectedAssetsRef.current.filter((item) => item.id !== cardId));
      } else {
        const newlySelected = selectedCollection?.assets?.find((asset) => asset.id === cardId);
        selectAssets(newlySelected ? [newlySelected] : selectedAssetsRef.current);
      }
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setIsPortrait(img.naturalHeight > img.naturalWidth);
    }
  };

  return (
    <Card
      isPressable
      onPress={(e: PressEvent) => onCardSelect(props.id, e)}
      onDoubleClick={undoSelectAssets}
      shadow={cn(props.isSelected ? "lg" : "sm") as ("lg" | "sm")}
      className={cn(
        props.isSelected ? "border-1.5 border-primary-500" : "border-1 border-default-400",
        props.isUniformFrame
          ? "w-full h-full justify-center items-center bg-default-50 dark:bg-black/60"
          : "h-full w-auto",
        "flex-shrink-0 overflow-hidden"
      )}
    >
      {props.allowZoom ? (
        <ModalZoomImage
          className={cn(
            props.isUniformFrame
              ? (isPortrait ? "object-contain max-h-full max-w-full" : "object-cover w-full h-full")
              : "object-contain h-full w-auto",
            "rounded-none"
          )}
          alt={props.alt}
          src={props.previewUrl}
          removeWrapper
          onLoad={handleImageLoad}
        />
      ) : (
        <Image
          className={cn(
            props.isUniformFrame
              ? (isPortrait ? "object-contain max-h-full max-w-full" : "object-cover w-full h-full")
              : "object-contain h-full w-auto",
            "rounded-none"
          )}
          alt={props.alt}
          src={props.previewUrl}
          removeWrapper
          onLoad={handleImageLoad}
        />
      )}
    </Card>
  );
}

export default AssetCard;
