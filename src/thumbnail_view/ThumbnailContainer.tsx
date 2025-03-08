import React, {useState} from "react";
import ThumbnailCard from "./ThumbnailCard.tsx";
import {ThumbnailCardProps} from "./ViewModel.ts";
import ImageDetailCard from "./ImageDetailCard.tsx";


function ThumbnailContainer() {

  const [selectedCardID, setSelectedCardId] = useState<string | null>(null);

  const onCardSelect = (cardId: string) => {
    setSelectedCardId(cardId);

    setCards(cards =>
      cards.map(card => (card.isSelected = (card.id === cardId), card))
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
        <h1 className="bg-background">Selected Item: {selectedCardID}</h1>
      </ul>

      <ImageDetailCard/>
    </>
  )
}

export default ThumbnailContainer
