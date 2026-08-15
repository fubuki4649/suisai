import React from "react";
import {Collection} from "../../../types/models.ts";
import RightClickButton from "../../../components/RightClickButton.tsx";
import {Disclosure} from "../../../types/disclosure.ts";
import {cn} from "@heroui/react";

export interface CollectionButtonProps {
  collection: Collection;
  expanded: boolean;
  selectedCollection: Collection | null;
  onCollectionSelect: (collection: Collection) => void;
  setRightClickCollection: (collection: Collection) => void;
  renameCollectionDisclosure: Disclosure;
  moveCollectionDisclosure: Disclosure;
  deleteCollectionDisclosure: Disclosure;
}

export const CollectionButton: React.FC<CollectionButtonProps> = ({
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
  const isSelected = selectedCollection?.id === collection.id;

  return (
    <RightClickButton
      btnProps={{
        className: cn(
          "px-3 py-2 text-sm justify-start rounded-xl transition-all",
          isSelected
            ? "bg-accent/15 text-accent font-semibold shadow-xs"
            : expanded
              ? "bg-default-100 text-foreground font-medium"
              : "text-foreground/80 hover:text-foreground hover:bg-default-100/70"
        ),
        children: collection.label,
        variant: isSelected ? "secondary" : (expanded ? "secondary" : "ghost"),
        onPress: () => onCollectionSelect(collection),
      }}
      rightClickItems={[
        {
          key: "rename",
          children: "Rename",
          isDisabled: isUnfiled,
          onPress: () => {
            setRightClickCollection(collection);
            renameCollectionDisclosure.open();
          },
        },
        {
          key: "move",
          children: "Move",
          isDisabled: isUnfiled,
          onPress: () => {
            setRightClickCollection(collection);
            moveCollectionDisclosure.open();
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
            deleteCollectionDisclosure.open();
          },
        },
      ]}
    />
  );
};

export default CollectionButton;
