import React from "react";

export type ImageCardProps = {
  id: number,
  previewUrl: string,
  isSelected: boolean,
}


export type ICCProps = React.HTMLAttributes<HTMLUListElement> & {
  cardWidth?: number
};