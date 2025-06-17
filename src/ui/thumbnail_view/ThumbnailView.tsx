import React, {useEffect, useState} from "react";
import ThumbnailCard from "./ThumbnailCard.tsx";
import {ThumbnailCardProps} from "./ViewModel.ts";
import {useSelectedAlbum, useSelectedPhotos} from "../../models/GlobalContext.tsx";
import InspectorPanel from "./inspector_panel/InspectorPanel.tsx";


function ThumbnailView() {

  const [selectedAlbum] = useSelectedAlbum()
  const [selectedPhotos, setSelectedPhotos] = useSelectedPhotos();

  const [cards, setCards] = useState<ThumbnailCardProps[]>([]);


  // Update cards on photo select/deselect
  useEffect(() => {
    setCards(cards => {
      const selectedPhotoIds: number[] = selectedPhotos.map(photo => photo.photoId)
      return cards.map(
        card => {
          return {...card, isSelected: (selectedPhotoIds.includes(card.id))}
        }
      )
    });
  }, [selectedPhotos]);


  // Update cards on album change/load
  useEffect(() => {
    setCards((selectedAlbum?.photos ?? []).map(photo => {
      return {
        id: photo.photoId,
        previewUrl: `http://localhost:8000/api/thumbnail/${photo.hash}`,
        isSelected: false,
        properties: {
          ...photo,
          photoDate: new Date(photo.photoDate)
        }
      }
    }))
    setSelectedPhotos([])
  }, [selectedAlbum]);


  return (
    <>
      { cards.length ?
        <ul className="flex flex-wrap flex-grow h-full overflow-auto scrollbar-hide content-start gap-6 p-6 grid-cols-auto">
          {cards.map(card => (
            <li key={card.id}>
              <ThumbnailCard {...card} />
            </li>
          ))}
        </ul>
        :
        <div className="flex flex-wrap flex-grow justify-center items-center">
          <p className="text-default-600 text-xl">{selectedAlbum == null ? "No Album Selected" : "Album is Empty"}</p>
        </div>
      }

      <div className="flex flex-row">
        {(selectedAlbum?.photos?.length ?? 0) != 0 && <InspectorPanel/>}
      </div>
    </>
  )
}

export default ThumbnailView
