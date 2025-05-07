import React, {useEffect, useRef, useState} from "react";
import ThumbnailCard from "./ThumbnailCard.tsx";
import {ThumbnailCardProps} from "./ViewModel.ts";
import {useSelectedAlbum, useSelectedPhotos} from "../../models/GlobalContext.tsx";
import ImageDetailCardStack from "./ImageDetailCardStack.tsx";


function ThumbnailContainer() {

  const [selectedAlbum] = useSelectedAlbum()
  const [selectedPhotos, setSelectedPhotos] = useSelectedPhotos();
  const selectedPhotosRef = useRef(selectedPhotos);

  const [cards, setCards] = useState<ThumbnailCardProps[]>([]);


  // Handles thumbnail card selection: toggles the selected state for that card and updates the metadata panel
  const onCardSelect = (cardId: number) => {
    // Card already selected - deselect
    if (selectedPhotosRef.current.some(photo => photo.photoId === cardId)) {
      setSelectedPhotos(selectedPhotosRef.current.filter(item => item.photoId !== cardId))
    }
    // Card not selected - select
    else {
      const newlySelected = selectedAlbum?.photos.find(photo => photo.photoId === cardId);
      setSelectedPhotos(newlySelected ? selectedPhotosRef.current.concat(newlySelected) : selectedPhotosRef.current);
    }
  }


  // Update cards on photo select/deselect
  useEffect(() => {
    selectedPhotosRef.current = selectedPhotos;

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
        previewUrl: photo.thumbnailUrl,
        isSelected: false,
        onClick: onCardSelect,
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
        <ul className="flex flex-wrap flex-grow content-start gap-6 p-6 grid-cols-auto">
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
        {selectedPhotos.length !== 0 && <ImageDetailCardStack/>}
      </div>
    </>
  )
}

export default ThumbnailContainer
