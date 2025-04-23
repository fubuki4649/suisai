import React, {useEffect, useState} from "react";
import ThumbnailCard from "./ThumbnailCard.tsx";
import {ThumbnailCardProps} from "./ViewModel.ts";
import ImageDetailCard from "./ImageDetailCard.tsx";
import {Album} from "../model/models.ts";


function ThumbnailContainer(props: {album: (Album | null)}) {

  const [selectedCardID, setSelectedCardId] = useState<number | null>(null);

  // Handles thumbnail card selection: toggles the selected state for that card and updates the metadata panel
  const onCardSelect = (cardId: number) => {
    setSelectedCardId(prev => (prev == cardId) ? null : cardId);

    setCards(cards => cards.map(card => {
        return {...card, isSelected: (card.id === cardId && !card.isSelected)}
      })
    )
  }


  const [cards, setCards] = useState<ThumbnailCardProps[]>([]);

  // Update cards on album change/load
  useEffect(() => {
    setCards((props.album?.photos ?? []).map(photo => {
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
    setSelectedCardId(null)
  }, [props.album]);


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
          <p className="text-default-600 text-xl">{props.album == null ? "No Album Selected" : "Album is Empty"}</p>
        </div>
      }

      <div className="flex flex-row">
        {selectedCardID && <ImageDetailCard {...cards.find(card => card.id === selectedCardID)!.properties} />}
      </div>
    </>
  )
}

export default ThumbnailContainer
