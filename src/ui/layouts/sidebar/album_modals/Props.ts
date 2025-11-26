import {Album} from "../../../../models/model.ts";
import {Disclosure} from "../../../../models/modal-disclosure.ts";

export type AlbumModalProps = {
  disclosure: Disclosure,
  album: Album,
};