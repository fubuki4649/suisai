import React, {useEffect, useRef} from "react";
import {Icon} from "@iconify/react";
import {useSelectedCollection, useSelectedAssets} from "../../../context/GalleryContext.tsx";
import AssetGrid from "../components/AssetGrid.tsx";
import AssetActionsCard from "../components/AssetActionsCard.tsx";
import ModalZoomImage from "../../../components/ModalZoomImage.tsx";
import DataStrip from "../components/DataStrip.tsx";
import EmptyState from "../../../components/EmptyState.tsx";
import {BACKEND_URL} from "../../../config.ts";
const CARD_WIDTH = 150;
const CARD_GAP = 16; // gap-4 is 16px
const SCROLL_AMOUNT = CARD_WIDTH + CARD_GAP;

function LightboxView() {
  const [selectedCollection] = useSelectedCollection();
  const [selectedAssets, setSelectedAssets] = useSelectedAssets();

  const selectedAssetsRef = useRef(selectedAssets);
  const selectedCollectionRef = useRef(selectedCollection);
  const filmstripScrollRef = useRef<HTMLUListElement>(null);

  useEffect(() => { selectedCollectionRef.current = selectedCollection; }, [selectedCollection]);
  useEffect(() => { selectedAssetsRef.current = selectedAssets; }, [selectedAssets]);

  const stepAsset = React.useCallback(
    (direction: -1 | 1) => {
      const assets = selectedCollectionRef.current?.assets;
      if (!assets || assets.length === 0) return;

      const currentId = selectedAssetsRef.current[0]?.id;
      const idx = assets.findIndex((a) => a.id === currentId);
      const targetIdx = idx === -1 ? 0 : idx + direction;

      if (targetIdx >= 0 && targetIdx < assets.length) {
        setSelectedAssets([assets[targetIdx]]);
        filmstripScrollRef.current?.scrollBy({ left: direction * SCROLL_AMOUNT, behavior: "smooth" });
      }
    },
    [setSelectedAssets]
  );

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        stepAsset(e.key === "ArrowLeft" ? -1 : 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [stepAsset]);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (filmstripScrollRef.current) filmstripScrollRef.current.scrollLeft += e.deltaY;
  };

  const activeAsset = selectedAssets[0];

  return (
    <div className="flex flex-col grow min-h-0">
      {/* Lightbox Viewing Area */}
      <div className="flex flex-row grow overflow-auto justify-center">
        {activeAsset ? (
          <>
            <div className="flex flex-col w-full justify-center select-none">
              <div className="flex flex-row max-h-full justify-center items-center">
                <Icon
                  icon="gravity-ui:chevron-left"
                  className="w-12 h-12 shrink-0 mx-6 hover:text-foreground active:text-foreground/80 cursor-pointer transition-colors"
                  onClick={() => stepAsset(-1)}
                />

                <ModalZoomImage
                  className="object-scale-down rounded-none shadow-2xl max-h-[75vh]"
                  alt={activeAsset.file_name}
                  src={`${BACKEND_URL}/thumbnail/${activeAsset.hash}`}
                  removeWrapper
                />

                <Icon
                  icon="gravity-ui:chevron-right"
                  className="w-12 h-12 shrink-0 mx-6 text-muted hover:text-foreground cursor-pointer transition-colors"
                  onClick={() => stepAsset(1)}
                />
              </div>
            </div>
            <AssetActionsCard vertical />
          </>
        ) : (
          <EmptyState
            message={
              selectedCollection?.id == null
                ? "No Collection Selected"
                : selectedCollection?.assets?.length === 0
                ? "Collection is Empty"
                : "No Asset Selected"
            }
          />
        )}
      </div>

      {/* Filmstrip & DataStrip Area */}
      {(selectedCollection?.assets?.length ?? 0) !== 0 && (
        <div className="border-separator border-t shadow-md">
          <DataStrip />
          <div className="grid grid-rows-1 bg-surface" onWheel={onWheel}>
            <AssetGrid
              className="flex flex-row w-full overflow-x-auto gap-4 p-4 pt-2"
              cardWidth={CARD_WIDTH}
              cardHeight={100}
              ref={filmstripScrollRef}
              allowCardZoom
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default LightboxView;
