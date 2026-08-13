import React from "react";
import {useSelectedCollection, useSelectedAssets} from "../../../context/GalleryContext.tsx";
import AssetGrid from "../assets/AssetGrid.tsx";
import AssetActionsCard from "../assets/AssetActionsCard.tsx";
import MetadataCardStack from "../assets/MetadataCardStack.tsx";

export function GridView() {
  const [selectedCollection] = useSelectedCollection();
  const [selectedAssets] = useSelectedAssets();

  return (
    <div className="flex flex-grow">
      <AssetGrid
        className="flex flex-wrap flex-grow overflow-auto scrollbar-hide content-start gap-5 p-5 grid-cols-auto"
        allowCardZoom
      />

      {(selectedCollection?.assets?.length ?? 0) !== 0 && (
        <div className="flex flex-col justify-between">
          <MetadataCardStack />
          {selectedAssets.length !== 0 && <AssetActionsCard />}
        </div>
      )}
    </div>
  );
}

export default GridView;
