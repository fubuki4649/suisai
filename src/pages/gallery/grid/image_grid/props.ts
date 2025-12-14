import React from "react";

export type ImageGridProps = React.HTMLAttributes<HTMLUListElement> & {
  cardWidth?: number,
  allowCardZoom?: boolean,
};