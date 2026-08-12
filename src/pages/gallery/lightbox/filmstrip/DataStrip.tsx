import {useSelectedAssets} from "../../../../components/GlobalContext.tsx";
import {cn} from "@heroui/react";

export default function DataStrip() {
  const [selectedAssets] = useSelectedAssets();
  const lastSelectedAsset = selectedAssets[selectedAssets.length - 1];

  const timestamp = lastSelectedAsset && new Date(lastSelectedAsset.photo_date);
  const dateOptions: Intl.DateTimeFormatOptions | undefined = lastSelectedAsset ? {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: lastSelectedAsset.photo_timezone,
  } : undefined;

  const timeOptions: Intl.DateTimeFormatOptions | undefined = lastSelectedAsset ? {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: lastSelectedAsset.photo_timezone,
    timeZoneName: "short",
  } : undefined;

  return (
    <div className={cn(lastSelectedAsset ? "pt-2 pb-1" : "py-2", "flex flex-row justify-center gap-12 bg-default-100 shadow-2xl")}>
      { lastSelectedAsset && timestamp && (
        <>
          <div className="flex flex-row gap-9 justify-center">
            <span className="flex items-center gap-3">
              <p className="text-medium font-light">Asset</p>
              <p className="text-large font-bold">{lastSelectedAsset.file_name}</p>
            </span>
            <span className="flex items-center gap-3">
              <p className="text-medium font-light">Date/Time</p>
              <p className="text-large font-bold">{timestamp.toLocaleDateString("en-US", dateOptions)}</p>
              <p className="text-large font-medium">{timestamp.toLocaleTimeString("en-US", timeOptions)}</p>
            </span>
          </div>

          <div className="flex flex-row gap-9 justify-center">
            <span className="flex items-center gap-3">
              <p className="text-medium font-light">Shutter</p>
              <p className="text-large font-medium">{lastSelectedAsset.shutter_speed}</p>
            </span>
            <span className="flex items-center gap-3">
              <p className="text-medium font-light">ISO</p>
              <p className="text-large font-medium">{lastSelectedAsset.iso}</p>
            </span>
            <span className="flex items-center gap-3">
              <p className="text-medium font-light">Aperture</p>
              <p className="text-large font-medium">{lastSelectedAsset.aperture}</p>
            </span>
          </div>
        </>
      )}
    </div>
  );
}