import {Card, cn, Image, PressEvent} from "@heroui/react";
import React, {useEffect, useRef} from "react";
import {ImageCardProps} from "./ViewModel.ts";
import {useSelectedAlbum, useSelectedPhotos} from "../../models/GlobalContext.tsx";


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
      if (selectedPhotosRef.current.some(photo => photo.photoId === cardId)) {
        setSelectedPhotos(selectedPhotosRef.current.filter(item => item.photoId !== cardId))
      }
      // Else perform a multi-select
      else {
        const newlySelected = selectedAlbum?.photos?.find(photo => photo.photoId === cardId);
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
        const newlySelected = selectedAlbum?.photos?.find(photo => photo.photoId === cardId);
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
      className={cn(props.isSelected && "border-2 border-secondary", props.isSelected && "m-[-2px]", "h-fit w-fit flex-shrink-0")}
    >
      <Image
        alt="Card background"
        className="rounded-xl"
        src={props.previewUrl}
        width={270}
      />
    </Card>
  )
}

export default ImageCard
