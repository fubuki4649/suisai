export type Photo = {
  photoId: number;
  thumbnailUrl: string;
  hash: string;
  fileName: string,
  filePath: string,
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
  photos: Photo[],
}