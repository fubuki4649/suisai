import {Album} from "../../../../models/model.ts";
import {Disclosure} from "../../../../viewmodel/ModalDisclosures.ts";

export type AlbumModalProps = {
  disclosure: Disclosure,
  album: Album,
};