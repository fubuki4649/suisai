import React, {useState} from "react";
import ThumbnailCard from "./ThumbnailCard.tsx";
import {ThumbnailCardProps} from "./ViewModel.ts";
import ImageDetailCard from "./ImageDetailCard.tsx";
import {Album} from "../model/objects.ts";


function ThumbnailContainer(props: {album: (Album | null)}) {

  const [selectedCardID, setSelectedCardId] = useState<string | null>(null);

  const onCardSelect = (cardId: string) => {
    setSelectedCardId(prev => (prev == cardId) ? null : cardId);

    setCards(cards => cards.map(card => {
        return {...card, isSelected: (card.id === cardId && !card.isSelected)}
      })
    )
  }

  const [cards, setCards] = useState<ThumbnailCardProps[]>([
    {id: "juan", contentUrl: "https://cdn.jetphotos.com/full/5/40931_1587092365.jpg", isSelected: false, onClick: onCardSelect},
    {id: "つ", contentUrl: "https://cdn.jetphotos.com/full/6/1042605_1741347047.jpg", isSelected: false, onClick: onCardSelect},
    {id: "three", contentUrl: "https://cdn.jetphotos.com/full/6/92518_1541393083.jpg", isSelected: false, onClick: onCardSelect},
    {id: "fo", contentUrl: "https://cdn.jetphotos.com/full/5/66513_1538107938.jpg", isSelected: false, onClick: onCardSelect}
  ]);


  return (
    <>
      <ul className="flex flex-wrap flex-grow content-start gap-6 p-6 grid-cols-auto">
        {cards.map((card) => (
          <li key={card.id}>
            <ThumbnailCard {...card} />
          </li>
        ))}
      </ul>

      <ImageDetailCard/>
    </>
  )
}

export default ThumbnailContainer
