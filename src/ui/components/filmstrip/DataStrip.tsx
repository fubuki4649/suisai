import {useSelectedPhotos} from "../../../models/GlobalContext.tsx";
import {cn} from "@heroui/react";


export default function DataStrip() {

  const [selectedPhotos] = useSelectedPhotos();
  const lastSelectedPhoto = selectedPhotos[selectedPhotos.length - 1];

  const timestamp = lastSelectedPhoto && new Date(lastSelectedPhoto.photoDate);
  const dateOptions: Intl.DateTimeFormatOptions = lastSelectedPhoto && {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: lastSelectedPhoto.photoTimezone
  };

  const timeOptions: Intl.DateTimeFormatOptions = lastSelectedPhoto && {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: lastSelectedPhoto.photoTimezone,
    timeZoneName: 'short',
  }

  return (
    <div className={cn(lastSelectedPhoto? " pt-2 pb-1" : "py-2", "flex flex-row justify-center gap-12 bg-default-100 shadow-2xl")}>
      { lastSelectedPhoto &&
        <>
          <div className="flex flex-row gap-9 justify-center">
            <span className="flex items-center gap-3">
              <p className="text-medium font-light">Photo</p>
              <p className="text-large font-bold">{lastSelectedPhoto.fileName}</p>
            </span>
            <span className="flex items-center gap-3">
              <p className="text-medium font-light">Date/Time</p>
              <p className="text-large font-bold">{timestamp.toLocaleDateString('en-US', dateOptions)}</p>
              <p className="text-large font-medium">{timestamp.toLocaleTimeString('en-US', timeOptions)}</p>
            </span>

          </div>

          <div className="flex flex-row gap-9 justify-center">
            <span className="flex items-center gap-3">
              <p className="text-medium font-light">Shutter</p>
              <p className="text-large font-medium">{lastSelectedPhoto.shutterSpeed}</p>
            </span>
            <span className="flex items-center gap-3">
              <p className="text-medium font-light">ISO</p>
              <p className="text-large font-medium">{lastSelectedPhoto.iso}</p>
            </span>
            <span className="flex items-center gap-3">
              <p className="text-medium font-light">Aperture</p>
              <p className="text-large font-medium">{lastSelectedPhoto.aperture}</p>
            </span>
          </div>
        </>
      }
    </div>
  )
}