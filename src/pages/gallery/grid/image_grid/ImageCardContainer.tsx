import ImageCard from "./image_card/ImageCard.tsx";
import React, {forwardRef, useEffect, useState} from "react";
import {useSelectedCollection, useSelectedAssets} from "../../../../components/GlobalContext.tsx";
import {BACKEND_URL} from "../../../../config.ts";
import {ImageGridProps} from "./props.ts";
import {ImageCardProps} from "./image_card/props.ts";

const ImageCardContainer = forwardRef<HTMLUListElement, ImageGridProps>((props, ref) => {
  const [selectedCollection] = useSelectedCollection();
  const [selectedAssets, setSelectedAssets] = useSelectedAssets();

  const [cards, setCards] = useState<ImageCardProps[]>([]);

  // Update cards on asset select/deselect
  useEffect(() => {
    setCards((cards) => {
      const selectedAssetIds: string[] = selectedAssets.map((asset) => asset.id);
      return cards.map((card) => {
        return {...card, isSelected: selectedAssetIds.includes(card.id)};
      });
    });
  }, [selectedAssets]);

  // Update cards on collection change/load
  useEffect(() => {
    setCards((selectedCollection?.assets ?? []).map((asset) => {
      return {
        id: asset.id,
        alt: asset.file_name,
        previewUrl: `${BACKEND_URL}/thumbnail/${asset.hash}`,
        isSelected: false,
        allowZoom: !!props.allowCardZoom,
      };
    }));
    setSelectedAssets([]);
  }, [selectedCollection, props.allowCardZoom, setSelectedAssets]);

  return (
    <>
      { cards.length ? (
        <ul className={props.className} ref={ref}>
          {cards.map((card) => (
            // Putting this here so Tailwind compiler includes this: w-[256px]
            <li className={`flex-shrink-0 w-[${props.cardWidth ?? 256}px]`} key={card.id}>
              <ImageCard {...card} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-wrap flex-grow justify-center items-center">
          <p className="text-default-600 text-3xl">{selectedCollection == null ? "No Collection Selected" : "Collection is Empty"}</p>
        </div>
      )}
    </>
  );
});

export default ImageCardContainer;