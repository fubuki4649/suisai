import ImageCardContainer from "../common/ImageCardContainer.tsx";
import React, {RefObject, useEffect, useRef} from "react";
import {useSelectedAlbum, useSelectedPhotos} from "../../models/GlobalContext.tsx";

function Filmstrip({ scrollRef } : { scrollRef: RefObject<HTMLUListElement | null> }) {

  const [selectedPhotos, setSelectedPhotos] = useSelectedPhotos();
  const selectedPhotosRef = useRef(selectedPhotos);

  const [selectedAlbum] = useSelectedAlbum();
  const selectedAlbumRef = useRef(selectedAlbum);


  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    // Apply vertical scroll value to horizontal scroll.
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };


  // Update ref on photo select/deselect
  useEffect(() => {
    selectedAlbumRef.current = selectedAlbum;
  }, [selectedAlbum]);

  // Update ref on photo select/deselect
  useEffect(() => {
    selectedPhotosRef.current = selectedPhotos;
  }, [selectedPhotos]);

  // Intercept left/right arrows to enable keyboard-based scrolling
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!scrollRef.current) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const idx = selectedAlbumRef.current?.photos?.findIndex(photo => selectedPhotosRef.current[0].photoId == photo.photoId) ?? 0;

        if (idx - 1 >= 0) {
          setSelectedPhotos(selectedAlbumRef.current?.photos?.[idx-1] ? [selectedAlbumRef.current?.photos?.[idx-1]] : []);
        }

        scrollRef.current.scrollLeft -= 170;

      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const idx = selectedAlbumRef.current?.photos?.findIndex(photo => selectedPhotosRef.current[0].photoId == photo.photoId) ?? 0;

        if (idx + 1 < (selectedAlbumRef.current?.photos?.length ?? 0)) {
          setSelectedPhotos(selectedAlbumRef.current?.photos?.[idx+1] ? [selectedAlbumRef.current?.photos?.[idx+1]] : []);
        }

        scrollRef.current.scrollLeft += 170;
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);


  return (
    <>
      {(selectedAlbum?.photos?.length ?? 0) != 0 &&
        <div className="grid grid-rows-1 bg-default-100 shadow-2xl" onWheel={onWheel}>
          {/* Putting this here so the Tailwind compiler includes it: w-[150px] */}
          <ImageCardContainer className="flex flex-row w-full overflow-x-auto gap-5 p-5" cardWidth={150} ref={scrollRef}/>
        </div>
      }
    </>
  )
}

export default Filmstrip