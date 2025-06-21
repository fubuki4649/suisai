import {useSelectedAlbum, useSelectedPhotos} from "../../models/GlobalContext.tsx";
import React from "react";


function BigScreen() {

  const [selectedAlbum] = useSelectedAlbum();
  const [selectedPhotos] = useSelectedPhotos();

  return (
    <div className="flex flex-grow overflow-auto justify-center">
      { selectedPhotos[0] ?
        <img className="object-scale-down shadow-2xl" src={`http://localhost:8000/api/thumbnail/${selectedPhotos[0].hash}`} alt="" />
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