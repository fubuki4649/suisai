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
  sizeOnDisk: number,
  photoTime: Date,
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