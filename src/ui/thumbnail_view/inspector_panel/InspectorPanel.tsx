import React from "react";
import {useSelectedPhotos} from "../../../models/GlobalContext.tsx";
import {InspectorMetadataProps} from "../ViewModel.ts";
import MetadataCard from "./MetadataCard.tsx";
import ActionsCard from "./ActionsCard.tsx";


export default function InspectorPanel() {

  const [selectedPhotos] = useSelectedPhotos();

  return(
    <div className="flex flex-col justify-between">
      <div className="relative w-80 m-6">
        {
          [...selectedPhotos].reverse().map((photo, index) => {

            // Only show the first 4 photos in the stack
            if (index > 3) return;

            const offset = index * 20; // vertical stacking offset
            const scale = 1 - index * 0.02; // slight scale-down effect

            const cardProps: InspectorMetadataProps = {
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
                <MetadataCard {...cardProps} />
              </div>
            );

          })}
      </div>

      {(selectedPhotos.length) != 0 && <ActionsCard />}
    </div>
  )

}