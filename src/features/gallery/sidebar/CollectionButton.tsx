import React from "react";
import {Collection} from "../../../types/models.ts";
import RightClickButton from "../../../components/RightClickButton.tsx";
import {Disclosure} from "../../../types/disclosure.ts";
import {cn} from "@heroui/react";
import {Icon} from "@iconify/react";

export interface CollectionButtonProps {
  collection: Collection;
  expanded: boolean;
  hasChildren: boolean;
  onToggleExpand: (e: React.MouseEvent) => void;
  onCollapseRecursively: (col: Collection) => void;
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
  hasChildren,
  onToggleExpand,
  onCollapseRecursively,
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
          "w-full px-2.5 py-2 text-sm justify-start rounded-xl transition-all overflow-hidden group select-none",
          isSelected
            ? "bg-accent/15 text-accent font-semibold shadow-xs"
            : "text-foreground/80 hover:text-foreground hover:bg-default-100/70"
        ),
        variant: isSelected ? "secondary" : "ghost",
        onPress: () => onCollectionSelect(collection),
        onDoubleClick: () => {
          if (hasChildren) {
            onCollapseRecursively(collection);
          }
        },
        children: (
          <div className="flex items-center gap-1.5 w-full overflow-hidden">
            {hasChildren ? (
              <span
                className="p-0.5 hover:bg-default-200/60 rounded-md cursor-pointer transition-colors shrink-0"
                onClick={onToggleExpand}
              >
                <Icon
                  icon="gravity-ui:chevron-right"
                  className={cn(
                    "w-3.5 h-3.5 text-muted transition-transform duration-150 shrink-0",
                    expanded && "rotate-90"
                  )}
                />
              </span>
            ) : (
              <span className="w-3.5 shrink-0" />
            )}

            <Icon
              icon={
                isUnfiled
                  ? "gravity-ui:tray"
                  : hasChildren && expanded
                  ? "gravity-ui:folder-open"
                  : "gravity-ui:folder"
              }
              className={cn(
                "w-4 h-4 shrink-0 transition-colors",
                isSelected
                  ? "text-accent"
                  : "text-muted group-hover:text-foreground"
              )}
            />

            <span className="truncate text-left">
              {collection.label}
            </span>
          </div>
        ),
      }}
      rightClickItems={[
        {
          key: "rename",
          children: (
            <>
              <Icon icon="gravity-ui:pencil" className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0" />
              <span className="flex-1">Rename</span>
            </>
          ),
          isDisabled: isUnfiled,
          onPress: () => {
            setRightClickCollection(collection);
            renameCollectionDisclosure.open();
          },
        },
        {
          key: "move",
          children: (
            <>
              <Icon icon="gravity-ui:folder-arrow-right" className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0" />
              <span className="flex-1">Move</span>
            </>
          ),
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
          children: (
            <>
              <Icon icon="gravity-ui:trash-bin" className="w-4 h-4 text-danger transition-colors shrink-0" />
              <span className="flex-1">Delete</span>
            </>
          ),
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
