import React from "react";
import {useSelectedAlbum} from "../../models/GlobalContext.tsx";
import InspectorPanel from "./inspector_panel/InspectorPanel.tsx";
import ImageCardContainer from "../common/ImageCardContainer.tsx";


function ThumbnailView() {

  const [selectedAlbum] = useSelectedAlbum()

  return (
    <div className="flex flex-grow">

      <ImageCardContainer className="flex flex-wrap flex-grow overflow-auto scrollbar-hide content-start gap-5 p-5 grid-cols-auto"/>

      <div className="flex flex-row">
        {(selectedAlbum?.photos?.length ?? 0) != 0 && <InspectorPanel/>}
      </div>
    </div>
  )
}

export default ThumbnailView
