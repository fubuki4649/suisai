import {useSelectedAssets} from "../../../context/GalleryContext.tsx";
import {cn} from "@heroui/react";
import React from "react";

export function DataStrip() {
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
    <div className={cn(lastSelectedAsset ? "pt-1.5 pb-0.5" : "py-1", "flex flex-row justify-center items-center gap-10 bg-surface text-foreground transition-all")}>
      { lastSelectedAsset && timestamp && (
        <>
          <div className="flex flex-row gap-8 justify-center items-center">
            <span className="flex items-center gap-2">
              <span className="text-xs text-muted">Asset</span>
              <span className="text-md font-bold truncate max-w-xs">{lastSelectedAsset.file_name}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="text-xs text-muted">Date/Time</span>
              <span className="text-md font-bold">{timestamp.toLocaleDateString("en-US", dateOptions)}</span>
              <span className="text-sm font-medium text-muted">{timestamp.toLocaleTimeString("en-US", timeOptions)}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="text-xs text-muted">Focal Length</span>
              <span>
                <span className="text-md font-bold">{lastSelectedAsset.focal_length}</span>
                <span className="text-md font-medium text-muted pl-0.5">mm</span>
              </span>
            </span>
            <span className="flex items-center gap-2">
              <span className="text-xs text-muted">Shutter</span>
              <span className="text-md font-bold">{lastSelectedAsset.shutter_speed}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="text-xs text-muted">ISO</span>
              <span className="text-md font-bold">{lastSelectedAsset.iso}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="text-xs text-muted">Aperture</span>
              <span className="text-md font-bold">ƒ/{lastSelectedAsset.aperture.toFixed(1)}</span>
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default DataStrip;
