import {Album} from "../../../../api/models.ts";
import {Disclosure} from "../../../../components/modal-disclosure.ts";

export type AlbumModalProps = {
  disclosure: Disclosure,
  album: Album,
};