export type ThumbnailCardProps = {
  id: number,
  previewUrl: string,
  isSelected: boolean,
  onClick: (id: number) => void,
  properties: DetailCardProps,
}

export type DetailCardProps = {
  fileName: string,
  filePath: string,
  sizeOnDisk: number,
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