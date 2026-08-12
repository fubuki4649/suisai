export type Asset = {
  id: string;
  parent_id?: string | null;
  thumbnail_path?: string | null;
  hash: string;
  file_name: string;
  size_on_disk: number;
  photo_date: string;
  photo_timezone: string;
  resolution_width: number;
  resolution_height: number;
  mime_type: string;
  camera_model: string;
  lens_model: string;
  shutter_count: number;
  focal_length: number;
  iso: number;
  shutter_speed: string;
  aperture: number;
};

export type Collection = {
  id: string;
  label: string;
  parent_id?: string | null;
  assets: Asset[] | null;
  children: Collection[];
};

export type CollectionTree = {
  id: string;
  label: string;
  children: CollectionTree[];
};