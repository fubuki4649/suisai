export type MetadataCardProps = {
  file_name: string;
  size_on_disk: number;
  photo_date: Date;
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