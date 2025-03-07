import React, {useState} from "react";
import ThumbnailCard from "./ThumbnailCard.tsx";
import {ThumbnailCardProps} from "./ViewModel.ts";


function ThumbnailContainer() {

  const [selectedCardID, setSelectedCardId] = useState<string | null>(null);

  const onCardSelect = (cardId: string) => {
    setSelectedCardId(cardId);
  }

  const cards: ThumbnailCardProps[] = [
    {id: "juan", contentUrl: "https://heroui.com/images/hero-card-complete.jpeg", isSelected: false, onClick: onCardSelect},
    {id: "つ", contentUrl: "https://heroui.com/images/hero-card-complete.jpeg", isSelected: false, onClick: onCardSelect},
    {id: "three", contentUrl: "https://heroui.com/images/hero-card-complete.jpeg", isSelected: false, onClick: onCardSelect}
  ]

  return (
    <ul className="flex flex-wrap flex-grow content-start gap-6 p-6 grid-cols-auto">
        {
          cards.map((card) => (
            <li key={card.id}>
              <ThumbnailCard {...card} />
            </li>
          ))
        }
        <h1 className="bg-black">Selected Item: {selectedCardID}</h1>
    </ul>
  )
}

export default ThumbnailContainer
