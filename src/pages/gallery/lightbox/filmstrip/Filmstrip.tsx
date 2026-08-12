import ImageCardContainer from "../../grid/image_grid/ImageCardContainer.tsx";
import React, {RefObject, useEffect, useRef} from "react";
import {useSelectedCollection, useSelectedAssets} from "../../../../components/GlobalContext.tsx";
import DataStrip from "./DataStrip.tsx";

function Filmstrip({ scrollRef } : { scrollRef: RefObject<HTMLUListElement | null> }) {
  const [selectedAssets, setSelectedAssets] = useSelectedAssets();
  const selectedAssetsRef = useRef(selectedAssets);

  const [selectedCollection] = useSelectedCollection();
  const selectedCollectionRef = useRef(selectedCollection);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    // Apply vertical scroll value to horizontal scroll.
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  // Update ref on collection select/deselect
  useEffect(() => {
    selectedCollectionRef.current = selectedCollection;
  }, [selectedCollection]);

  // Update ref on asset select/deselect
  useEffect(() => {
    selectedAssetsRef.current = selectedAssets;
  }, [selectedAssets]);

  // Intercept left/right arrows to enable keyboard-based scrolling
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!scrollRef.current) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const idx = selectedCollectionRef.current?.assets?.findIndex(
          (asset) => selectedAssetsRef.current[0]?.id === asset.id
        ) ?? 0;

        if (idx - 1 >= 0) {
          setSelectedAssets(selectedCollectionRef.current?.assets?.[idx - 1] ? [selectedCollectionRef.current?.assets?.[idx - 1]] : []);
        }

        scrollRef.current.scrollLeft -= 170;
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const idx = selectedCollectionRef.current?.assets?.findIndex(
          (asset) => selectedAssetsRef.current[0]?.id === asset.id
        ) ?? 0;

        if (idx + 1 < (selectedCollectionRef.current?.assets?.length ?? 0)) {
          setSelectedAssets(selectedCollectionRef.current?.assets?.[idx + 1] ? [selectedCollectionRef.current?.assets?.[idx + 1]] : []);
        }

        scrollRef.current.scrollLeft += 170;
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [scrollRef, setSelectedAssets]);

  return (
    <>
      {(selectedCollection?.assets?.length ?? 0) !== 0 && (
        <>
          <DataStrip />
          <div className="grid grid-rows-1 bg-default-100" onWheel={onWheel}>
            {/* Putting this here so the Tailwind compiler includes it: w-[150px] */}
            <ImageCardContainer className="flex flex-row w-full overflow-x-auto gap-5 p-5 pt-1" cardWidth={150} ref={scrollRef} allowCardZoom/>
          </div>
        </>
      )}
    </>
  );
}

export default Filmstrip;