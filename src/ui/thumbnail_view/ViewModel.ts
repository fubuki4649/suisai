import {MetadataCardProps} from "./inspector_panel/ViewModel.ts";

export type ThumbnailCardProps = {
  id: number,
  previewUrl: string,
  isSelected: boolean,
  properties: MetadataCardProps,
}
