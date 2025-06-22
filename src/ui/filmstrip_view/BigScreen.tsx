import {useSelectedAlbum, useSelectedPhotos} from "../../models/GlobalContext.tsx";
import React, {useEffect, useRef} from "react";
import InspectorPanel from "../thumbnail_view/inspector_panel/InspectorPanel.tsx";


function BigScreen() {

  const [selectedAlbum] = useSelectedAlbum();
  const [selectedPhotos] = useSelectedPhotos();

  return (
    <div className="flex flex-row flex-grow overflow-auto justify-center">
      { selectedPhotos[0] ?
        <>
          <div className="flex flex-col justify-center">
            <div className="flex flex-row max-h-full justify-center">
              <img className="object-scale-down shadow-2xl" src={`http://localhost:8000/api/thumbnail/${selectedPhotos[0].hash}`} alt="" />
            </div>
          </div>
          <InspectorPanel/>
        </>
        :
        <div className="flex flex-wrap flex-grow justify-center items-center">
          <p className="text-default-600 text-3xl">
            {(selectedAlbum?.albumId == null) ? "No Album Selected" : ((selectedAlbum?.photos?.length == 0) ? "Album is Empty" : "No Photo Selected")}
          </p>
        </div>
      }
    </div>
  )
}

export default BigScreen