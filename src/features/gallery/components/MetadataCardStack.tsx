import React from "react";
import {useSelectedAssets} from "../../../context/GalleryContext.tsx";
import MetadataCard, {MetadataCardProps} from "./MetadataCard.tsx";

export function MetadataCardStack() {
  const [selectedAssets] = useSelectedAssets();

  return (
    <div className="relative w-80 m-5">
      {
        [...selectedAssets].reverse().map((asset, index) => {
          if (index > 3) return null;

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
        })
      }
    </div>
  );
}

export default MetadataCardStack;
