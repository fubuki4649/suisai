import React from "react";
import {Collection} from "../../../api/models.ts";
import RightClickButton from "../../../components/right_click_button/RightClickButton.tsx";
import {Disclosure} from "../../../components/modal-disclosure.ts";

export interface AlbumButtonProps {
  collection: Collection;
  expanded: boolean;
  selectedCollection: Collection | null;
  onCollectionSelect: (collection: Collection) => void;
  setRightClickCollection: (collection: Collection) => void;
  renameCollectionDisclosure: Disclosure;
  moveCollectionDisclosure: Disclosure;
  deleteCollectionDisclosure: Disclosure;
}

const AlbumButton: React.FC<AlbumButtonProps> = ({
  collection,
  expanded,
  selectedCollection,
  onCollectionSelect,
  setRightClickCollection,
  renameCollectionDisclosure,
  moveCollectionDisclosure,
  deleteCollectionDisclosure,
}) => {
  const isUnfiled = collection.id === "-1";

  return (
    <RightClickButton
      btnProps={{
        className: "px-4 text-medium",
        children: collection.label,
        color: "default",
        variant: selectedCollection?.id === collection.id ? "faded" : (expanded ? "flat" : "light"),
        onPress: () => onCollectionSelect(collection),
      }}
      rightClickItems={[
        {
          key: "rename",
          children: "Rename",
          isDisabled: isUnfiled,
          onPress: () => {
            setRightClickCollection(collection);
            renameCollectionDisclosure.onOpen();
          },
        },
        {
          key: "move",
          children: "Move",
          isDisabled: isUnfiled,
          onPress: () => {
            setRightClickCollection(collection);
            moveCollectionDisclosure.onOpen();
          },
        },
        {
          key: "delete",
          className: "text-danger",
          color: "danger",
          children: "Delete",
          isDisabled: isUnfiled,
          onPress: () => {
            setRightClickCollection(collection);
            deleteCollectionDisclosure.onOpen();
          },
        },
      ]}
    />
  );
};

export default AlbumButton;
