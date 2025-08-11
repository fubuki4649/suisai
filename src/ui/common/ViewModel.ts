import React from "react";

export type ImageCardProps = {
  id: number,
  alt: string,
  previewUrl: string,
  isSelected: boolean,
  allowZoom: boolean,
}


export type ICCProps = React.HTMLAttributes<HTMLUListElement> & {
  cardWidth?: number,
  allowCardZoom?: boolean,
};