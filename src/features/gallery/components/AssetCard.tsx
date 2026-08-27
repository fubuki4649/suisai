import { Card, cn } from "@heroui/react";
import React, { useState } from "react";
import ModalZoomImage from "../../../components/ModalZoomImage.tsx";

export interface AssetCardProps {
  id: string;
  alt: string;
  previewUrl: string;
  isSelected: boolean;
  allowZoom: boolean;
  forceConstWidth?: boolean;
  onSelect?: (id: string, e: React.MouseEvent) => void;
  onDoubleClick?: () => void;
}

export const AssetCard = React.memo(function AssetCard(props: AssetCardProps) {
  const [isPortrait, setIsPortrait] = useState(false);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setIsPortrait(img.naturalHeight > img.naturalWidth);
    }
  };

  const imgClass = cn(
    props.forceConstWidth
      ? isPortrait
        ? "object-contain max-h-full max-w-full"
        : "object-cover w-full h-full"
      : "object-contain h-full w-auto",
    "rounded-none select-none"
  );

  const imgProps = {
    loading: "lazy" as const,
    decoding: "async" as const,
    className: imgClass,
    alt: props.alt,
    src: props.previewUrl,
    onLoad: handleImageLoad,
  };

  return (
    <Card
      className={cn(
        props.isSelected
          ? "border-2 border-accent shadow-lg ring-2 ring-accent/30 dark:ring-accent/40"
          : "border border-separator hover:border-1.5 hover:border-accent/60 hover:ring-2 hover:ring-accent/15 dark:hover:ring-accent/30",
        props.forceConstWidth
          ? "w-full h-full justify-center items-center bg-default-50 dark:bg-black/60"
          : "h-full w-auto",
        "shadow-md shrink-0 overflow-hidden cursor-pointer transition-all select-none rounded-xl p-0! gap-0!"
      )}
      onClick={(e) => props.onSelect?.(props.id, e)}
      onDoubleClick={props.onDoubleClick}
    >
      {props.allowZoom ? (
        <ModalZoomImage {...imgProps} />
      ) : (
        <img {...imgProps} />
      )}
    </Card>
  );
});

export default AssetCard;
