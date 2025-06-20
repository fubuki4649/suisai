import ImageCard from "./ImageCard.tsx";
import React, {useEffect, useState} from "react";
import {ImageCardProps} from "./ViewModel.ts";
import {useSelectedAlbum, useSelectedPhotos} from "../../models/GlobalContext.tsx";


export default function ImageCardContainer({ className }: { className?: string }) {

  const [selectedAlbum] = useSelectedAlbum()
  const [selectedPhotos, setSelectedPhotos] = useSelectedPhotos();

  const [cards, setCards] = useState<ImageCardProps[]>([]);


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
      }
    }))
    setSelectedPhotos([])
  }, [selectedAlbum]);


  return (
    <>
      { cards.length ?
        <ul className={className}>
          {cards.map(card => (
            <li className="flex-shrink-0" key={card.id}>
              <ImageCard {...card} />
            </li>
          ))}
        </ul>
        :
        <div className="flex flex-wrap flex-grow justify-center items-center">
          <p className="text-default-600 text-3xl">{selectedAlbum == null ? "No Album Selected" : "Album is Empty"}</p>
        </div>
      }
    </>
  )

}