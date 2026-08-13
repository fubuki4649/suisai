import React, {useEffect, useRef} from "react";
import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/24/solid";
import {useSelectedCollection, useSelectedAssets} from "../../../context/GalleryContext.tsx";
import AssetGrid from "../components/AssetGrid.tsx";
import AssetActionsCard from "../components/AssetActionsCard.tsx";
import ModalZoomImage from "../../../components/ModalZoomImage.tsx";
import DataStrip from "./DataStrip.tsx";
import {BACKEND_URL} from "../../../config.ts";

export function LightboxView() {
  const [selectedCollection] = useSelectedCollection();
  const [selectedAssets, setSelectedAssets] = useSelectedAssets();

  const selectedAssetsRef = useRef(selectedAssets);
  const selectedCollectionRef = useRef(selectedCollection);
  const filmstripScrollRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    selectedCollectionRef.current = selectedCollection;
  }, [selectedCollection]);

  useEffect(() => {
    selectedAssetsRef.current = selectedAssets;
  }, [selectedAssets]);

  const onPrev = () => {
    const assets = selectedCollection?.assets;
    if (!assets || assets.length === 0) return;

    const currentId = selectedAssets[0]?.id;
    const idx = assets.findIndex((a) => a.id === currentId);

    if (idx > 0) {
      setSelectedAssets([assets[idx - 1]]);
    } else if (idx === -1 && assets.length > 0) {
      setSelectedAssets([assets[0]]);
    }

    if (filmstripScrollRef.current) {
      filmstripScrollRef.current.scrollLeft -= 170;
    }
  };

  const onNext = () => {
    const assets = selectedCollection?.assets;
    if (!assets || assets.length === 0) return;

    const currentId = selectedAssets[0]?.id;
    const idx = assets.findIndex((a) => a.id === currentId);

    if (idx >= 0 && idx + 1 < assets.length) {
      setSelectedAssets([assets[idx + 1]]);
    } else if (idx === -1 && assets.length > 0) {
      setSelectedAssets([assets[0]]);
    }

    if (filmstripScrollRef.current) {
      filmstripScrollRef.current.scrollLeft += 170;
    }
  };

  // Keyboard navigation
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  });

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (filmstripScrollRef.current) {
      filmstripScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const activeAsset = selectedAssets[0];

  return (
    <div className="flex flex-col flex-grow">
      {/* Lightbox Viewing Area */}
      <div className="flex flex-row flex-grow overflow-auto justify-center">
        {activeAsset ? (
          <>
            <div className="flex flex-col w-full justify-center select-none">
              <div className="flex flex-row max-h-full justify-center">
                <ArrowLeftIcon
                  className="w-16 flex-shrink-0 h-full mx-10 text-default-500 hover:text-default-300 active:text-default-100 cursor-pointer transition-colors"
                  onClick={onPrev}
                />

                <ModalZoomImage
                  className="object-scale-down rounded-none shadow-2xl"
                  alt={`${BACKEND_URL}/thumbnail/${activeAsset.hash}`}
                  src={`${BACKEND_URL}/thumbnail/${activeAsset.hash}`}
                  removeWrapper
                />

                <ArrowRightIcon
                  className="w-16 flex-shrink-0 h-full mx-10 text-default-500 hover:text-default-300 active:text-default-100 cursor-pointer transition-colors"
                  onClick={onNext}
                />
              </div>
            </div>
            <AssetActionsCard vertical />
          </>
        ) : (
          <div className="flex flex-wrap flex-grow justify-center items-center">
            <p className="text-default-600 text-3xl">
              {selectedCollection?.id == null
                ? "No Collection Selected"
                : selectedCollection?.assets?.length === 0
                ? "Collection is Empty"
                : "No Asset Selected"}
            </p>
          </div>
        )}
      </div>

      {/* Filmstrip & DataStrip Area */}
      {(selectedCollection?.assets?.length ?? 0) !== 0 && (
        <>
          <DataStrip />
          <div className="grid grid-rows-1 bg-default-100" onWheel={onWheel}>
            <AssetGrid
              className="flex flex-row w-full overflow-x-auto gap-5 p-5 pt-1"
              cardWidth={150}
              cardHeight={100}
              ref={filmstripScrollRef}
              allowCardZoom
            />
          </div>
        </>
      )}
    </div>
  );
}

export default LightboxView;
