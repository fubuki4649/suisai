import ImageCardContainer from "../common/ImageCardContainer.tsx";
import React, {RefObject, useEffect, useRef} from "react";
import {useSelectedAlbum, useSelectedPhotos} from "../../models/GlobalContext.tsx";

function Filmstrip() {

  const [selectedPhotos, setSelectedPhotos] = useSelectedPhotos();
  const selectedPhotosRef = useRef(selectedPhotos);

  const [selectedAlbum] = useSelectedAlbum();
  const selectedAlbumRef = useRef(selectedAlbum);

  const scrollRef: RefObject<HTMLUListElement | null> = useRef(null);


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

        scrollRef.current.scrollLeft -= 294;

      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const idx = selectedAlbumRef.current?.photos?.findIndex(photo => selectedPhotosRef.current[0].photoId == photo.photoId) ?? 0;

        if (idx + 1 < (selectedAlbumRef.current?.photos?.length ?? 0)) {
          setSelectedPhotos(selectedAlbumRef.current?.photos?.[idx+1] ? [selectedAlbumRef.current?.photos?.[idx+1]] : []);
        }

        scrollRef.current.scrollLeft += 294;
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
        <div className="flex flex-col bg-default-100 shadow-2xl" style={{ zoom: (window.innerHeight <= 800 ? "0.6" : "0.8") }}>
          <div className="flex flex-row min-h-48" onWheel={onWheel}>
            <ImageCardContainer className="flex flex-row w-full overflow-x-auto gap-6 p-6" ref={scrollRef}/>
          </div>
        </div>
      }
    </>
  )
}

export default Filmstrip