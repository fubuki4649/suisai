import React, {forwardRef, useMemo} from "react";
import AssetCard from "./AssetCard.tsx";
import {useSelectedCollection, useSelectedAssets} from "../../../context/GalleryContext.tsx";
import {BACKEND_URL} from "../../../config.ts";
import EmptyState from "../../../components/EmptyState.tsx";

export interface AssetGridProps extends React.HTMLAttributes<HTMLUListElement> {
  cardWidth?: number;
  cardHeight?: number;
  allowCardZoom?: boolean;
}

export const AssetGrid = forwardRef<HTMLUListElement, AssetGridProps>((props, ref) => {
  const [selectedCollection] = useSelectedCollection();
  const [selectedAssets, setSelectedAssets] = useSelectedAssets();

  const selectedAssetIds = useMemo(() => new Set(selectedAssets.map((a) => a.id)), [selectedAssets]);

  const assets = selectedCollection?.assets;
  const targetHeight = props.cardHeight ?? 200;
  const isUniform = props.cardWidth !== undefined;

  // Pending single-click timer — cancelled if a dblclick fires first
  const clickTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearClickTimer = React.useCallback(() => {
    if (clickTimerRef.current !== null) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
  }, []);

  const handleCardClick = React.useCallback(
    (cardId: string, e: React.MouseEvent) => {
      const assetList = selectedCollection?.assets ?? [];
      const targetAsset = assetList.find((item) => item.id === cardId);
      if (!targetAsset) return;

      // Handle multi-select (Ctrl / Cmd)
      if (e.ctrlKey || e.metaKey) {
        setSelectedAssets((prev) =>
          prev.some((item) => item.id === cardId)
            ? prev.filter((item) => item.id !== cardId)
            : [...prev, targetAsset]
        );
        return;
      }

      // Handle continuous shift-select
      if (e.shiftKey && selectedAssets.length > 0) {
        const lastIdx = assetList.findIndex((item) => item.id === selectedAssets[selectedAssets.length - 1].id);
        const newIdx = assetList.findIndex((item) => item.id === cardId);

        if (lastIdx !== -1 && newIdx !== -1) {
          const slice = assetList.slice(Math.min(lastIdx, newIdx), Math.max(lastIdx, newIdx) + 1);
          const map = new Map(selectedAssets.map((item) => [item.id, item]));
          slice.forEach((item) => map.set(item.id, item));
          setSelectedAssets(Array.from(map.values()));
          return;
        }
      }

      // Single select / toggle off if already the sole selected asset
      const isSoleSelected = selectedAssets.length === 1 && selectedAssets[0].id === cardId;
      setSelectedAssets(isSoleSelected ? [] : [targetAsset]);
    },
    [selectedCollection?.assets, selectedAssets, setSelectedAssets]
  );

  const handleCardClickDebounced = React.useCallback(
    (cardId: string, e: React.MouseEvent) => {
      // Modifier-key clicks (ctrl/shift multi-select) are always instant
      if (e.ctrlKey || e.metaKey || e.shiftKey) {
        handleCardClick(cardId, e);
        return;
      }

      // Snapshot the event fields we need before React nullifies the synthetic event
      const snapshot = { ctrlKey: e.ctrlKey, metaKey: e.metaKey, shiftKey: e.shiftKey };
      clearClickTimer();
      clickTimerRef.current = setTimeout(() => {
        clickTimerRef.current = null;
        handleCardClick(cardId, { ...snapshot } as React.MouseEvent);
      }, 220);
    },
    [handleCardClick, clearClickTimer]
  );

  const handleCardDoubleClick = React.useCallback(() => {
    // Cancel the pending single-click so it doesn't fire after the zoom modal opens
    clearClickTimer();
  }, [clearClickTimer]);

  React.useEffect(() => clearClickTimer, [clearClickTimer]);

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
                onSelect={handleCardClickDebounced}
                onDoubleClick={handleCardDoubleClick}
              />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          message={selectedCollection?.id == null ? "No Collection Selected" : "Collection is Empty"}
        />
      )}
    </>
  );
});

export default AssetGrid;
