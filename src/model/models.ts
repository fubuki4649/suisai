export type Photo = {
  photoId: string;
  thumbnailUrl: string;
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

export type Album = {
  albumId: string,
  albumName: string,
  photos: string[],
}