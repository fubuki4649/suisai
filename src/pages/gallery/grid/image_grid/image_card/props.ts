export type ImageCardProps = {
  id: number,
  alt: string,
  previewUrl: string,
  isSelected: boolean,
  allowZoom: boolean,       // Whether to enable the "double click to zoom (to fullscreen modal)" behaviour
}