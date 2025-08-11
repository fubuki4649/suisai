import {Card, cn, Image, PressEvent} from "@heroui/react";
import React, {useEffect, useRef} from "react";
import {ImageCardProps} from "./ViewModel.ts";
import {useSelectedAlbum, useSelectedPhotos} from "../../models/GlobalContext.tsx";
import ModalZoomImage from "./ModalZoomImage.tsx";


function ImageCard(props: ImageCardProps) {

  const [selectedAlbum] = useSelectedAlbum()
  const [selectedPhotos, setSelectedPhotos] = useSelectedPhotos();
  const selectedPhotosRef = useRef(selectedPhotos);


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
        setSelectedPhotos(selectedPhotosRef.current.filter(iter => iter.photoId !== cardId))
      }
      // Else perform a multi-select
      else {
        const newlySelected = selectedAlbum?.photos?.find(iter => iter.photoId === cardId);
        setSelectedPhotos(newlySelected ? selectedPhotosRef.current.concat(newlySelected) : selectedPhotosRef.current);
      }
    }
    // Handle continuous multi-select
    else if (e.shiftKey) {

      // If nothing is selected, perform a normal select
      if (selectedPhotosRef.current.length == 0) {
        const newlySelectedPhoto = selectedAlbum?.photos?.find(iter => iter.photoId === cardId);
        setSelectedPhotos(newlySelectedPhoto ? [newlySelectedPhoto] : [])
      }
      // Select all photos between the last selected and newly selected photos (by index)
      else {
        const lastSelectedIndex = selectedAlbum?.photos?.findIndex(iter => iter.photoId === selectedPhotosRef.current[selectedPhotosRef.current.length - 1].photoId);
        const newlySelectedIndex = selectedAlbum?.photos?.findIndex(iter => iter.photoId === cardId);

        if (lastSelectedIndex != undefined || newlySelectedIndex != undefined) {
          // @ts-ignore
          const slice = selectedAlbum?.photos?.slice(Math.min(lastSelectedIndex, newlySelectedIndex), Math.max(lastSelectedIndex, newlySelectedIndex) + 1);
          setSelectedPhotos(slice ? selectedPhotosRef.current.concat(slice) : selectedPhotosRef.current);
        }
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
        const newlySelected = selectedAlbum?.photos?.find(photo => photo.photoId === cardId);
        setSelectedPhotos(newlySelected ? [newlySelected] : selectedPhotosRef.current);
      }
    }

  }



  return (
    <Card
      isPressable
      onPress={(e: PressEvent) => onCardSelect(props.id, e)}
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
