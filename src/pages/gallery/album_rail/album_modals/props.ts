import {Collection} from "../../../../api/models.ts";
import {Disclosure} from "../../../../components/modal-disclosure.ts";

export type CollectionModalProps = {
  disclosure: Disclosure;
  collection: Collection;
};

export type AlbumModalProps = {
  disclosure: Disclosure;
  album: Collection;
};