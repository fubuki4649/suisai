import { useSelectedAssets } from "../../../context/GalleryContext.tsx";
import { cn } from "@heroui/react";
import React from "react";

function DataStrip() {
  const [selectedAssets] = useSelectedAssets();
  const lastSelectedAsset = selectedAssets[selectedAssets.length - 1];

  const { formattedDate, formattedTime } = React.useMemo(() => {
    if (!lastSelectedAsset) return { formattedDate: "", formattedTime: "" };
    const date = new Date(lastSelectedAsset.photo_date);
    const timeZone = lastSelectedAsset.photo_timezone || undefined;

    return {
      formattedDate: date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone }),
      formattedTime: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone, timeZoneName: "short" }),
    };
  }, [lastSelectedAsset]);

  return (
    <div className={cn(lastSelectedAsset ? "pt-1.5 pb-0.5" : "py-1", "flex flex-row justify-center items-center gap-10 bg-surface text-foreground transition-all")}>
      {lastSelectedAsset && (
        <div className="flex flex-row gap-8 justify-center items-center">
          {[
            { label: "Asset", value: <span className="text-base font-bold truncate max-w-xs">{lastSelectedAsset.file_name}</span> },
            {
              label: "Date/Time",
              value: (
                <>
                  <span className="text-base font-bold">{formattedDate}</span>
                  <span className="text-sm font-medium text-muted">{formattedTime}</span>
                </>
              ),
            },
            {
              label: "Focal Length",
              value: (
                <span>
                  <span className="text-base font-bold">{lastSelectedAsset.focal_length}</span>
                  <span className="text-base font-medium text-muted pl-0.5">mm</span>
                </span>
              ),
            },
            { label: "Shutter", value: <span className="text-base font-bold">{lastSelectedAsset.shutter_speed}</span> },
            { label: "ISO", value: <span className="text-base font-bold">{lastSelectedAsset.iso}</span> },
            { label: "Aperture", value: <span className="text-base font-bold">ƒ/{lastSelectedAsset.aperture.toFixed(1)}</span> },
          ].map(({ label, value }) => (
            <span key={label} className="flex items-center gap-2">
              <span className="text-xs text-muted">{label}</span>
              {value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default DataStrip;
