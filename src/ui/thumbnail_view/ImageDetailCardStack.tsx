import React from "react";
import {useSelectedPhotos} from "../../models/GlobalContext.tsx";
import {DetailCardProps} from "./ViewModel.ts";
import ImageDetailCard from "./ImageDetailCard.tsx";


export default function ImageDetailCardStack() {

  const [selectedPhotos] = useSelectedPhotos();

  return(
    <div className="relative w-80 m-6">
      {
        [...selectedPhotos].reverse().map((photo, index) => {

          const offset = index * 20; // vertical stacking offset
          const scale = 1 - index * 0.02; // slight scale-down effect

          const cardProps: DetailCardProps = {
            ...photo,
            photoDate: new Date(photo.photoDate)
          }

          return (
            <div className="absolute top-0 left-0 w-full transition-all" key={photo.photoId}
              style={{
                transform: `translateY(${offset}px) scale(${scale})`,
                  zIndex: selectedPhotos.length - index,
                  opacity: index === 0 ? 1 : 0.8,
              }}
            >
              <ImageDetailCard {...cardProps} />
            </div>
          );

      })}
    </div>
  )

}