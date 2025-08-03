import ImageCard from "./ImageCard.tsx";
import React, {forwardRef, useEffect, useState} from "react";
import {ICCProps, ImageCardProps} from "./ViewModel.ts";
import {useSelectedAlbum, useSelectedPhotos} from "../../models/GlobalContext.tsx";


const ImageCardContainer = forwardRef<HTMLUListElement, ICCProps>((props, ref) => {
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
        <ul className={props.className} ref={ref}>
          {cards.map(card => (
            // Putting this here so Tailwind compiler includes this: w-[256px]
            <li className={`flex-shrink-0 w-[${props.cardWidth ?? 256}px]`} key={card.id}>
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
});

export default ImageCardContainer;