import React from "react";
import {useSelectedAlbum, useSelectedPhotos} from "../../models/GlobalContext.tsx";
import ImageCardContainer from "../components/image_cards/ImageCardContainer.tsx";
import ActionsCard from "../components/action_card/ActionsCard.tsx";
import MetadataCardStack from "../components/metadata_card/MetadataCardStack.tsx";


function ThumbnailView() {

  const [selectedAlbum] = useSelectedAlbum();
  const [selectedPhotos] = useSelectedPhotos();

  return (
    <div className="flex flex-grow">
      <ImageCardContainer className="flex flex-wrap flex-grow overflow-auto scrollbar-hide content-start gap-5 p-5 grid-cols-auto" allowCardZoom/>

      {(selectedAlbum?.photos?.length ?? 0) != 0 &&
        <div className="flex flex-col justify-between">
          <MetadataCardStack />
          {(selectedPhotos.length) != 0 && <ActionsCard />}
        </div>
      }
    </div>
  )
}

export default ThumbnailView
