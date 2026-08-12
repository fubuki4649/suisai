import React from "react";
import {Collection} from "../../../api/models.ts";
import RightClickButton from "../../../components/right_click_button/RightClickButton.tsx";
import {Disclosure} from "../../../components/modal-disclosure.ts";

export interface CollectionButtonProps {
  collection?: Collection;
  album?: Collection;
  expanded: boolean;
  selectedCollection?: Collection | null;
  selectedAlbum?: Collection | null;
  onCollectionSelect?: (collection: Collection) => void;
  onAlbumSelect?: (album: Collection) => void;
  setRightClickCollection?: (collection: Collection) => void;
  setRightClickAlbum?: (album: Collection) => void;
  renameCollectionDisclosure?: Disclosure;
  renameAlbumDisclosure?: Disclosure;
  moveCollectionDisclosure?: Disclosure;
  moveAlbumDisclosure?: Disclosure;
  deleteCollectionDisclosure?: Disclosure;
  deleteAlbumDisclosure?: Disclosure;
}

const AlbumButton: React.FC<CollectionButtonProps> = ({
  collection: propCollection,
  album: propAlbum,
  expanded,
  selectedCollection: propSelectedCollection,
  selectedAlbum: propSelectedAlbum,
  onCollectionSelect,
  onAlbumSelect,
  setRightClickCollection,
  setRightClickAlbum,
  renameCollectionDisclosure,
  renameAlbumDisclosure,
  moveCollectionDisclosure,
  moveAlbumDisclosure,
  deleteCollectionDisclosure,
  deleteAlbumDisclosure,
}) => {
  const collection = propCollection ?? propAlbum!;
  const selected = propSelectedCollection !== undefined ? propSelectedCollection : propSelectedAlbum;
  const onSelect = onCollectionSelect ?? onAlbumSelect!;
  const setRightClick = setRightClickCollection ?? setRightClickAlbum!;
  const renameDisclosure = renameCollectionDisclosure ?? renameAlbumDisclosure!;
  const moveDisclosure = moveCollectionDisclosure ?? moveAlbumDisclosure!;
  const deleteDisclosure = deleteCollectionDisclosure ?? deleteAlbumDisclosure!;

  const isUnfiled = collection.id === "-1";

  return (
    <RightClickButton
      btnProps={{
        className: "px-4 text-medium",
        children: collection.label,
        color: "default",
        variant: selected?.id === collection.id ? "faded" : (expanded ? "flat" : "light"),
        onPress: () => onSelect(collection),
      }}
      rightClickItems={[
        {
          key: "rename",
          children: "Rename",
          isDisabled: isUnfiled,
          onPress: () => {
            setRightClick(collection);
            renameDisclosure.onOpen();
          },
        },
        {
          key: "move",
          children: "Move",
          isDisabled: isUnfiled,
          onPress: () => {
            setRightClick(collection);
            moveDisclosure.onOpen();
          },
        },
        {
          key: "delete",
          className: "text-danger",
          color: "danger",
          children: "Delete",
          isDisabled: isUnfiled,
          onPress: () => {
            setRightClick(collection);
            deleteDisclosure.onOpen();
          },
        },
      ]}
    />
  );
};

export default AlbumButton;
