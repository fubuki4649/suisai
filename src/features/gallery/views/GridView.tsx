import React from "react";
import {useSelectedCollection, useSelectedAssets} from "../../../context/GalleryContext.tsx";
import AssetGrid from "../components/AssetGrid.tsx";
import AssetActionsCard from "../components/AssetActionsCard.tsx";
import MetadataCardStack from "../components/MetadataCardStack.tsx";

export function GridView() {
  const [selectedCollection] = useSelectedCollection();
  const [selectedAssets] = useSelectedAssets();

  return (
    <div className="flex flex-grow overflow-y-auto min-h-0">
      <AssetGrid
        className="flex flex-wrap flex-grow content-start gap-5 p-5 grid-cols-auto"
        cardHeight={200}
        allowCardZoom
      />

      {(selectedCollection?.assets?.length ?? 0) !== 0 && (
        <div className="flex flex-col justify-between shrink-0 sticky top-0 h-full self-start">
          <MetadataCardStack />
          {selectedAssets.length !== 0 && <AssetActionsCard />}
        </div>
      )}
    </div>
  );
}

export default GridView;
