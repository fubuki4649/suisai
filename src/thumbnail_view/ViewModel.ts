export type ThumbnailCardProps = {
  id: string,
  previewUrl: string,
  isSelected: boolean,
  onClick: (id: string) => void,
  properties: DetailCardProps,
}

export type DetailCardProps = {
  fileName: string,
  filePath: string,
  sizeOnDisk: string,
  photoDate: Date,
  photoTimezone: string,
  resolution: [number, number],
  mimeType: string,
  cameraModel: string,
  lensModel: string,
  shutterCount: number,
  focalLength: number,
  iso: number,
  shutterSpeed: string,
  aperture: number,
}