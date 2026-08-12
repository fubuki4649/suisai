import React from "react";
import {useSelectedCollection, useSelectedAssets} from "../../../components/GlobalContext.tsx";
import ImageCardContainer from "./image_grid/ImageCardContainer.tsx";
import ActionsCard from "../action_card/ActionsCard.tsx";
import MetadataCardStack from "./metadata_card/MetadataCardStack.tsx";

function GridView() {
  const [selectedCollection] = useSelectedCollection();
  const [selectedAssets] = useSelectedAssets();

  return (
    <div className="flex flex-grow">
      <ImageCardContainer className="flex flex-wrap flex-grow overflow-auto scrollbar-hide content-start gap-5 p-5 grid-cols-auto" allowCardZoom/>

      {(selectedCollection?.assets?.length ?? 0) !== 0 && (
        <div className="flex flex-col justify-between">
          <MetadataCardStack />
          {selectedAssets.length !== 0 && <ActionsCard />}
        </div>
      )}
    </div>
  );
}

export default GridView;
