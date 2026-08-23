import React, {forwardRef, useMemo} from "react";
import AssetCard from "./AssetCard.tsx";
import {useSelectedCollection, useSelectedAssets} from "../../../context/GalleryContext.tsx";
import {BACKEND_URL} from "../../../config.ts";

export interface AssetGridProps extends React.HTMLAttributes<HTMLUListElement> {
  cardWidth?: number;
  cardHeight?: number;
  allowCardZoom?: boolean;
}

export const AssetGrid = forwardRef<HTMLUListElement, AssetGridProps>((props, ref) => {
  const [selectedCollection] = useSelectedCollection();
  const [selectedAssets, setSelectedAssets] = useSelectedAssets();

  const selectedAssetIds = useMemo(() => {
    return new Set(selectedAssets.map((asset) => asset.id));
  }, [selectedAssets]);

  const assets = selectedCollection?.assets;
  const targetHeight = props.cardHeight ?? 200;
  const isUniform = props.cardWidth !== undefined;

  const handleCardClick = React.useCallback(
    (cardId: string, e: React.MouseEvent) => {
      const assetList = selectedCollection?.assets ?? [];

      // Handle multi-select
      if (e.ctrlKey || e.metaKey) {
        if (selectedAssets.some((item) => item.id === cardId)) {
          setSelectedAssets(selectedAssets.filter((item) => item.id !== cardId));
        } else {
          const newlySelected = assetList.find((item) => item.id === cardId);
          if (newlySelected) {
            setSelectedAssets([...selectedAssets, newlySelected]);
          }
        }
      }
      // Handle continuous shift-select
      else if (e.shiftKey) {
        if (selectedAssets.length === 0) {
          const newlySelected = assetList.find((item) => item.id === cardId);
          setSelectedAssets(newlySelected ? [newlySelected] : []);
        } else {
          const lastSelected = selectedAssets[selectedAssets.length - 1];
          const lastIdx = assetList.findIndex((item) => item.id === lastSelected.id);
          const newIdx = assetList.findIndex((item) => item.id === cardId);

          if (lastIdx !== -1 && newIdx !== -1) {
            const slice = assetList.slice(Math.min(lastIdx, newIdx), Math.max(lastIdx, newIdx) + 1);
            const map = new Map(selectedAssets.map((item) => [item.id, item]));
            for (const item of slice) {
              map.set(item.id, item);
            }
            setSelectedAssets(Array.from(map.values()));
          }
        }
      }
      // Handle single select / toggle
      else {
        if (selectedAssets.length === 1 && selectedAssets[0].id === cardId) {
          setSelectedAssets([]);
        } else {
          const newlySelected = assetList.find((item) => item.id === cardId);
          setSelectedAssets(newlySelected ? [newlySelected] : []);
        }
      }
    },
    [selectedCollection?.assets, selectedAssets, setSelectedAssets]
  );

  return (
    <>
      {assets && assets.length > 0 ? (
        <ul className={props.className} ref={ref}>
          {assets.map((asset) => (
            <li
              className="shrink-0 [content-visibility:auto] [contain-intrinsic-size:auto_200px]"
              style={{
                height: `${targetHeight}px`,
                width: isUniform ? `${props.cardWidth}px` : undefined,
              }}
              key={asset.id}
            >
              <AssetCard
                id={asset.id}
                alt={asset.file_name}
                previewUrl={`${BACKEND_URL}/thumbnail/${asset.hash}`}
                isSelected={selectedAssetIds.has(asset.id)}
                allowZoom={!!props.allowCardZoom}
                forceConstWidth={isUniform}
                onSelect={handleCardClick}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-wrap grow justify-center items-center select-none">
          <p className="text-muted text-3xl font-light tracking-wide">
            {selectedCollection?.id == null ? "No Collection Selected" : "Collection is Empty"}
          </p>
        </div>
      )}
    </>
  );
});

export default AssetGrid;
