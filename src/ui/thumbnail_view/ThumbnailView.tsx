import React, {useEffect, useRef, useState} from "react";
import ThumbnailCard from "./ThumbnailCard.tsx";
import {ThumbnailCardProps} from "./ViewModel.ts";
import {useSelectedAlbum, useSelectedPhotos} from "../../models/GlobalContext.tsx";
import InspectorPanel from "./inspector_panel/InspectorPanel.tsx";
import {PressEvent} from "@heroui/react";


function ThumbnailView() {

  const [selectedAlbum] = useSelectedAlbum()
  const [selectedPhotos, setSelectedPhotos] = useSelectedPhotos();
  const selectedPhotosRef = useRef(selectedPhotos);

  const [cards, setCards] = useState<ThumbnailCardProps[]>([]);


  // Handles thumbnail card selection: toggles the selected state for that card and updates the metadata panel
  const onCardSelect = (cardId: number, e: PressEvent) => {

    // Handle multi-select
    if (e.ctrlKey || e.metaKey) {

      // Perform a multi-deselect if the pressed card is already selected,
      if (selectedPhotosRef.current.some(photo => photo.photoId === cardId)) {
        setSelectedPhotos(selectedPhotosRef.current.filter(item => item.photoId !== cardId))
      }
      // Else perform a multi-select
      else {
        const newlySelected = selectedAlbum?.photos.find(photo => photo.photoId === cardId);
        setSelectedPhotos(newlySelected ? selectedPhotosRef.current.concat(newlySelected) : selectedPhotosRef.current);
      }

    }
    // Handle continuous multi-select
    else if (e.shiftKey) {

      // TODO: Determine what the intended behaviour for continuous multi-select should be
      // TODO: Behaves like a normal multi-select for now
      // ---
      // Perform a multi-deselect if the pressed card is already selected,
      if (selectedPhotosRef.current.some(photo => photo.photoId === cardId)) {
        setSelectedPhotos(selectedPhotosRef.current.filter(item => item.photoId !== cardId))
      }
      // Else perform a multi-select
      else {
        const newlySelected = selectedAlbum?.photos.find(photo => photo.photoId === cardId);
        setSelectedPhotos(newlySelected ? selectedPhotosRef.current.concat(newlySelected) : selectedPhotosRef.current);
      }

    }
    // Handle normal select
    else {

      // Perform a single deselect if the pressed card is the only selected card,
      if (selectedPhotosRef.current.some(photo => photo.photoId === cardId) && selectedPhotosRef.current.length === 1) {
        setSelectedPhotos(selectedPhotosRef.current.filter(item => item.photoId !== cardId))
      }
      // Else perform a single select
      else {
        const newlySelected = selectedAlbum?.photos.find(photo => photo.photoId === cardId);
        setSelectedPhotos(newlySelected ? [newlySelected] : selectedPhotosRef.current);
      }

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
        {(selectedAlbum?.photos?.length ?? 0) != 0 && <InspectorPanel/>}
      </div>
    </>
  )
}

export default ThumbnailView
