import {useSelectedAlbum, useSelectedPhotos} from "../../models/GlobalContext.tsx";
import React, {RefObject} from "react";
import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/24/solid";
import ActionsCard from "./action_card/ActionsCard.tsx";
import ModalZoomImage from "./ModalZoomImage.tsx";
import {BACKEND_URL} from "../../config.ts";


function Lightbox({ scrollRef } : { scrollRef: RefObject<HTMLUListElement | null> }) {

  const [selectedAlbum] = useSelectedAlbum();
  const [selectedPhotos, setSelectedPhotos] = useSelectedPhotos();

  const leftArrowHandler = () => {
    const idx = selectedAlbum?.photos?.findIndex(photo => selectedPhotos[0].photoId == photo.photoId) ?? 0;

    if (idx - 1 >= 0) {
      setSelectedPhotos(selectedAlbum?.photos?.[idx-1] ? [selectedAlbum?.photos?.[idx-1]] : []);
    }

    if(scrollRef.current != null) scrollRef.current.scrollLeft -= 170;
  }

  const rightArrowHandler = () => {
    const idx = selectedAlbum?.photos?.findIndex(photo => selectedPhotos[0].photoId == photo.photoId) ?? 0;

    if (idx + 1 < (selectedAlbum?.photos?.length ?? 0)) {
      setSelectedPhotos(selectedAlbum?.photos?.[idx+1] ? [selectedAlbum?.photos?.[idx+1]] : []);
    }

    if(scrollRef.current != null) scrollRef.current.scrollLeft += 170;
  }

  return (
    <div className="flex flex-row flex-grow overflow-auto justify-center">
      { selectedPhotos[0] ?
        // Viewing Area
        <>
          <div className="flex flex-col justify-center select-none">
            <div className="flex flex-row max-h-full justify-center">
              <ArrowLeftIcon className="w-16 flex-shrink-0 h-full mx-10 text-default-500 active:text-default-100" onClick={leftArrowHandler} />

              <ModalZoomImage
                className="object-scale-down rounded-none shadow-2xl"
                alt={`${BACKEND_URL}/thumbnail/${selectedPhotos[0].hash}`}
                src={`${BACKEND_URL}/thumbnail/${selectedPhotos[0].hash}`}
                removeWrapper
              />

              <ArrowRightIcon className="w-16 flex-shrink-0 h-full mx-10 text-default-500 active:text-default-100" onClick={rightArrowHandler} />
            </div>
          </div>
          <ActionsCard vertical/>
        </>
        :
        // Nothing Selected message
        <div className="flex flex-wrap flex-grow justify-center items-center">
          <p className="text-default-600 text-3xl">
            {(selectedAlbum?.albumId == null) ? "No Album Selected" : ((selectedAlbum?.photos?.length == 0) ? "Album is Empty" : "No Photo Selected")}
          </p>
        </div>
      }
    </div>
  )
}

export default Lightbox