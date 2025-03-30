import React, {useEffect, useState} from "react";
import ThumbnailCard from "./ThumbnailCard.tsx";
import {ThumbnailCardProps} from "./ViewModel.ts";
import ImageDetailCard from "./ImageDetailCard.tsx";
import {Album} from "../model/models.ts";
import {getPhoto} from "../model/endpoints.ts";


function ThumbnailContainer(props: {album: (Album | null)}) {

  const [selectedCardID, setSelectedCardId] = useState<string | null>(null);

  const onCardSelect = (cardId: string) => {
    setSelectedCardId(prev => (prev == cardId) ? null : cardId);

    setCards(cards => cards.map(card => {
        return {...card, isSelected: (card.id === cardId && !card.isSelected)}
      })
    )
  }


  const [cards, setCards] = useState<ThumbnailCardProps[]>([]);

  useEffect(() => {
    setCards((props.album?.photos ?? []).map(id => {
      const photo = getPhoto(id)
      return {
        id: photo.photoId,
        previewUrl: photo.thumbnailUrl,
        isSelected: false,
        onClick: onCardSelect,
        properties: {...photo}
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

      {selectedCardID && <ImageDetailCard {...cards.find(card => card.id === selectedCardID)!.properties} />}
    </>
  )
}

export default ThumbnailContainer
