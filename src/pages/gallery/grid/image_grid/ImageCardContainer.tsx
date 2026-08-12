import ImageCard from "./image_card/ImageCard.tsx";
import React, {forwardRef, useMemo} from "react";
import {useSelectedCollection, useSelectedAssets} from "../../../../components/GlobalContext.tsx";
import {BACKEND_URL} from "../../../../config.ts";
import {ImageGridProps} from "./props.ts";

const ImageCardContainer = forwardRef<HTMLUListElement, ImageGridProps>((props, ref) => {
  const [selectedCollection] = useSelectedCollection();
  const [selectedAssets] = useSelectedAssets();

  const selectedAssetIds = useMemo(() => {
    return new Set(selectedAssets.map((asset) => asset.id));
  }, [selectedAssets]);

  const assets = selectedCollection?.assets;

  return (
    <>
      {assets && assets.length > 0 ? (
        <ul className={props.className} ref={ref}>
          {assets.map((asset) => (
            <li className={`flex-shrink-0 w-[${props.cardWidth ?? 256}px]`} key={asset.id}>
              <ImageCard
                id={asset.id}
                alt={asset.file_name}
                previewUrl={`${BACKEND_URL}/thumbnail/${asset.hash}`}
                isSelected={selectedAssetIds.has(asset.id)}
                allowZoom={!!props.allowCardZoom}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-wrap flex-grow justify-center items-center">
          <p className="text-default-600 text-3xl">
            {selectedCollection == null ? "No Collection Selected" : "Collection is Empty"}
          </p>
        </div>
      )}
    </>
  );
});

export default ImageCardContainer;