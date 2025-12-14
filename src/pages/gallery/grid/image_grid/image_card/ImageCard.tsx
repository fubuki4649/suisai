import {Card, cn, Image, PressEvent} from "@heroui/react";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useSelectedAlbum, useSelectedPhotos} from "../../../../../components/GlobalContext.tsx";
import ModalZoomImage from "../../../../../components/ModalZoomImage.tsx";
import {Photo} from "../../../../../api/models.ts";
import {ImageCardProps} from "./props.ts";


function ImageCard(props: ImageCardProps) {

  const [selectedAlbum] = useSelectedAlbum()
  const [selectedPhotos, setSelectedPhotos] = useSelectedPhotos();
  const selectedPhotosRef = useRef(selectedPhotos);

  // For undoing double clicks
  const [prevSelectedPhotos, setPrevSelectedPhotos] = useState<Photo[]>([]);
  const [prevSelectedPhotos2, setPrevSelectedPhotos2] = useState<Photo[]>([]);

  const selectPhotos = useCallback((newSelectedPhotos: Photo[]) => {
    setPrevSelectedPhotos2(prevSelectedPhotos);
    setPrevSelectedPhotos(selectedPhotos);
    setSelectedPhotos(newSelectedPhotos);
  }, [prevSelectedPhotos, selectedPhotos, setSelectedPhotos]);

  const undoSelectPhotos = useCallback(() => {
    setSelectedPhotos(prevSelectedPhotos2);
  }, [prevSelectedPhotos2, setSelectedPhotos]);


  // Update ref on photo select/deselect
  useEffect(() => {
    selectedPhotosRef.current = selectedPhotos;
  }, [selectedPhotos]);


  // Handles thumbnail card selection: toggles the selected state for that card and updates the metadata panel
  const onCardSelect = (cardId: number, e: PressEvent) => {

    // Handle multi-select
    if (e.ctrlKey || e.metaKey) {

      // Perform a multi-deselect if the pressed card is already selected,
      if (selectedPhotosRef.current.some(iter => iter.photoId === cardId)) {
        selectPhotos(selectedPhotosRef.current.filter(iter => iter.photoId !== cardId))
      }
      // Else perform a multi-select
      else {
        const newlySelected = selectedAlbum?.photos?.find(iter => iter.photoId === cardId);
        selectPhotos(newlySelected ? selectedPhotosRef.current.concat(newlySelected) : selectedPhotosRef.current);
      }
    }
    // Handle continuous multi-select
    else if (e.shiftKey) {

      // If nothing is selected, perform a normal select
      if (selectedPhotosRef.current.length == 0) {
        const newlySelectedPhoto = selectedAlbum?.photos?.find(iter => iter.photoId === cardId);
        selectPhotos(newlySelectedPhoto ? [newlySelectedPhoto] : [])
      }
      // Select all photos between the last selected and newly selected photos (by index)
      else {
        const lastSelectedIndex = selectedAlbum?.photos?.findIndex(iter => iter.photoId === selectedPhotosRef.current[selectedPhotosRef.current.length - 1].photoId);
        const newlySelectedIndex = selectedAlbum?.photos?.findIndex(iter => iter.photoId === cardId);

        if (lastSelectedIndex != undefined || newlySelectedIndex != undefined) {
          // @ts-ignore
          const slice = selectedAlbum?.photos?.slice(Math.min(lastSelectedIndex, newlySelectedIndex), Math.max(lastSelectedIndex, newlySelectedIndex) + 1);
          selectPhotos(slice ? selectedPhotosRef.current.concat(slice) : selectedPhotosRef.current);
        }
      }

    }
    // Handle normal select
    else {

      // Perform a single deselect if the pressed card is the only selected card,
      if (selectedPhotosRef.current.some(photo => photo.photoId === cardId) && selectedPhotosRef.current.length === 1) {
        selectPhotos(selectedPhotosRef.current.filter(item => item.photoId !== cardId))
      }
      // Else perform a single select
      else {
        const newlySelected = selectedAlbum?.photos?.find(photo => photo.photoId === cardId);
        selectPhotos(newlySelected ? [newlySelected] : selectedPhotosRef.current);
      }
    }

  }



  return (
    <Card
      isPressable
      onPress={(e: PressEvent) => onCardSelect(props.id, e)}
      onDoubleClick={undoSelectPhotos}
      shadow={cn(props.isSelected ? "lg" : "sm") as ("lg" | "sm")}
      className={cn(props.isSelected ? "border-1.5 border-primary-500" : "border-1 border-default-400 h-fit w-fit flex-shrink-0")}
    >
      {
        props.allowZoom ?
          <ModalZoomImage
            className="rounded-none object-contain"
            alt={props.alt}
            src={props.previewUrl}
          />
          :
          <Image
            className="rounded-none object-contain"
            alt={props.alt}
            src={props.previewUrl}
          />
      }
    </Card>
  )
}

export default ImageCard
