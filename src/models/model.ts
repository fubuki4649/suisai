export type Photo = {
  photoId: number;
  hash: string;
  fileName: string,
  sizeOnDisk: number,
  photoDate: string,
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

export type Album = {
  albumId: number,
  albumName: string,
  photos: Photo[] | null,
}