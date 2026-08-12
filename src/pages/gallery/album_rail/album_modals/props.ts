import {Collection} from "../../../../api/models.ts";
import {Disclosure} from "../../../../components/modal-disclosure.ts";

export type CollectionModalProps = {
  disclosure: Disclosure;
  collection: Collection;
};