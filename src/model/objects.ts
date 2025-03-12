export type Photo = {
  thumbnailUrl: string;
  fileId: string;
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

export type Album = {
  albumId: string,
  albumName: string,
  photos: string[],
}