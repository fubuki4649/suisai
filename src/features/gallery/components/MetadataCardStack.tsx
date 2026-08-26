import React from "react";
import {useSelectedAssets} from "../../../context/GalleryContext.tsx";
import MetadataCard, {MetadataCardProps} from "./MetadataCard.tsx";

function MetadataCardStack() {
  const [selectedAssets] = useSelectedAssets();

  if (selectedAssets.length === 0) {
    return <div className="w-0" />;
  }

  // Only take the last 4 items (reversed) to render the stack
  const visibleAssets = selectedAssets.slice(-4).reverse();

  return (
    <div className="relative w-68 m-5">
      {visibleAssets.map((asset, index) => {
        const offset = index * 20;
        const scale = 1 - index * 0.02;

        const cardProps: MetadataCardProps = {
          ...asset,
          photo_date: new Date(asset.photo_date),
        };

        return (
          <div
            className="absolute top-0 left-0 w-full transition-all"
            key={asset.id}
            style={{
              transform: `translateY(${offset}px) scale(${scale})`,
              zIndex: selectedAssets.length - index,
              opacity: index === 0 ? 1 : 0.8,
            }}
          >
            <MetadataCard {...cardProps} />
          </div>
        );
      })}
    </div>
  );
}

export default MetadataCardStack;
