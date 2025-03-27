import {Album, Photo} from "./models.ts";

export function getAlbums(): Array<Album> {

  return [
    {
      albumId: "fdsafasd",
      albumName: "YYZ Precovid",
      photos: [
        "https://cdn.jetphotos.com/full/5/40931_1587092365.jpg",
        "https://cdn.jetphotos.com/full/6/1042605_1741347047.jpg",
        "https://cdn.jetphotos.com/full/6/92518_1541393083.jpg",
        "https://cdn.jetphotos.com/full/5/66513_1538107938.jpg",
      ]
    },
    {albumId: "jiothw", albumName: "YYZ Postcovid", photos: []},
    {albumId: "fdsa", albumName: "YHM", photos: []},
    {albumId: "htr", albumName: "Aruba", photos: []},
    {albumId: "jiogthw", albumName: "New York-JFK", photos: []},
    {albumId: "nhyr", albumName: "New York", photos: []},
    {albumId: "jiotgf233dshw", albumName: "Fort Lauderdale-FLL", photos: []},
    {albumId: "gfds", albumName: "Miami-MIA", photos: []},
    {albumId: "j75j", albumName: "Miami", photos: []},
    {albumId: "26t3", albumName: "Kennedy Space Center", photos: []},
  ]

}

export function getPhoto(photoID: string): Photo {

  return {
    thumbnailUrl: photoID,
    aperture: 11.0,
    cameraModel: "fdsafsf",
    fileId: photoID,
    fileName: "fdsafdsf",
    filePath: photoID,
    focalLength: 0,
    iso: 0,
    lensModel: "",
    mimeType: "",
    photoDate: new Date("2021-03-25"),
    photoTimezone: "America/Toronto",
    resolution: [6000, 4000],
    shutterCount: 0,
    shutterSpeed: "",
    sizeOnDisk: "59 MB"

  }

}