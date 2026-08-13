import React, {forwardRef, useMemo} from "react";
import AssetCard from "./AssetCard.tsx";
import {useSelectedCollection, useSelectedAssets} from "../../../context/GalleryContext.tsx";
import {BACKEND_URL} from "../../../config.ts";

export interface AssetGridProps extends React.HTMLAttributes<HTMLUListElement> {
  cardHeight?: number;
  allowCardZoom?: boolean;
}

export const AssetGrid = forwardRef<HTMLUListElement, AssetGridProps>((props, ref) => {
  const [selectedCollection] = useSelectedCollection();
  const [selectedAssets] = useSelectedAssets();

  const selectedAssetIds = useMemo(() => {
    return new Set(selectedAssets.map((asset) => asset.id));
  }, [selectedAssets]);

  const assets = selectedCollection?.assets;
  const targetHeight = props.cardHeight ?? 200;

  return (
    <>
      {assets && assets.length > 0 ? (
        <ul className={props.className} ref={ref}>
          {assets.map((asset) => (
            <li
              className="flex-shrink-0"
              style={{ height: `${targetHeight}px` }}
              key={asset.id}
            >
              <AssetCard
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

export default AssetGrid;
