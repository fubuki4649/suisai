import {cn, toast, useOverlayState} from "@heroui/react";
import React, {JSX, useCallback, useState} from "react";
import {useCollections, useSelectedCollection, useSelectedAssets} from "../../../context/GalleryContext.tsx";
import NewCollectionButton from "./NewCollectionButton.tsx";
import CollectionButton from "./CollectionButton.tsx";
import RenameCollectionModal from "./RenameCollectionModal.tsx";
import DeleteCollectionModal from "./DeleteCollectionModal.tsx";
import MoveCollectionModal from "./MoveCollectionModal.tsx";
import {Disclosure} from "../../../types/disclosure.ts";
import {queryCollection} from "../../../api/collections.ts";
import {Collection} from "../../../types/models.ts";

export function Sidebar() {
  const [collections] = useCollections();
  const [selectedCollection, setSelectedCollection] = useSelectedCollection();
  const [, setSelectedAssets] = useSelectedAssets();

  const [rightClickCollection, setRightClickCollection] = useState<Collection | null>(null);

  // Resizable width state with localStorage persistence
  const [width, setWidth] = useState<number>(() => {
    const saved = localStorage.getItem("suisai_sidebar_width");
    return saved ? Math.max(160, Math.min(500, parseInt(saved, 10))) : 240;
  });
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const startX = e.clientX;
      const startWidth = width;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = Math.min(Math.max(160, startWidth + (moveEvent.clientX - startX)), 500);
        setWidth(newWidth);
        localStorage.setItem("suisai_sidebar_width", newWidth.toString());
      };

      const onMouseUp = () => {
        setIsDragging(false);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [width]
  );

  const onCollectionSelect = (collection: Collection) => {
    // Only clear asset selection when switching to a DIFFERENT collection
    if (selectedCollection?.id !== collection.id) {
      setSelectedAssets([]);
    }

    // If assets already loaded, just select
    if (collection.assets != null) {
      setSelectedCollection(collection);
    } else {
      queryCollection(collection.id, () => {
        toast.danger("Error", {
          description: `Failed to load the contents of collection ${collection.label} (ID ${collection.id})`,
        });
      }).then((assets) => {
        collection.assets = assets;
        setSelectedCollection({...collection, assets});
      });
    }
  };

  const renameCollectionDisclosure: Disclosure = useOverlayState();
  const moveCollectionDisclosure: Disclosure = useOverlayState();
  const deleteCollectionDisclosure: Disclosure = useOverlayState();

  return (
    <aside
      style={{ width: `${width}px` }}
      className="relative flex flex-col shrink-0 bg-background/50 border-r border-separator h-full select-none"
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 pt-2 scrollbar-hide">
        {rightClickCollection && (
          <>
            <RenameCollectionModal disclosure={renameCollectionDisclosure} collection={rightClickCollection} />
            <MoveCollectionModal disclosure={moveCollectionDisclosure} collection={rightClickCollection} />
            <DeleteCollectionModal disclosure={deleteCollectionDisclosure} collection={rightClickCollection} />
          </>
        )}

        <ul className="space-y-1">
          {collections.map((collection) => (
            <ShowCollection
              depth={1}
              key={collection.id}
              collection={collection}
              selectedCollection={selectedCollection}
              onCollectionSelect={onCollectionSelect}
              setRightClickCollection={setRightClickCollection}
              renameCollectionDisclosure={renameCollectionDisclosure}
              moveCollectionDisclosure={moveCollectionDisclosure}
              deleteCollectionDisclosure={deleteCollectionDisclosure}
            />
          ))}
        </ul>

        <div className="my-2" />
        <NewCollectionButton />
      </div>

      {/* Draggable Resize Handle */}
      <div
        onMouseDown={onMouseDown}
        className={cn(
          "absolute top-0 right-0 w-1.5 h-full cursor-col-resize z-20 transition-colors",
          "hover:bg-accent/40 active:bg-accent",
          isDragging && "bg-accent"
        )}
        title="Drag to resize sidebar"
      />
    </aside>
  );
}

const ShowCollection = ({
  depth,
  collection,
  selectedCollection,
  onCollectionSelect,
  setRightClickCollection,
  renameCollectionDisclosure,
  moveCollectionDisclosure,
  deleteCollectionDisclosure,
}: {
  depth: number;
  collection: Collection;
  selectedCollection: Collection | null;
  onCollectionSelect: (collection: Collection) => void;
  setRightClickCollection: (collection: Collection) => void;
  renameCollectionDisclosure: Disclosure;
  moveCollectionDisclosure: Disclosure;
  deleteCollectionDisclosure: Disclosure;
}): JSX.Element => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = Boolean(collection.children && collection.children.length > 0);

  return (
    <li key={collection.id} className="relative">
      <CollectionButton
        expanded={expanded}
        hasChildren={hasChildren}
        onToggleExpand={(e) => {
          e.stopPropagation();
          setExpanded((prev) => !prev);
        }}
        collection={collection}
        selectedCollection={selectedCollection}
        onCollectionSelect={(col: Collection) => {
          onCollectionSelect(col);
        }}
        setRightClickCollection={setRightClickCollection}
        renameCollectionDisclosure={renameCollectionDisclosure}
        moveCollectionDisclosure={moveCollectionDisclosure}
        deleteCollectionDisclosure={deleteCollectionDisclosure}
      />

      {expanded && hasChildren && (
        <ul className="ml-3.5 pl-2 border-l border-separator/70 space-y-1 mt-1">
          {collection.children!.map((child) => (
            <ShowCollection
              depth={depth + 1}
              key={child.id}
              collection={child}
              selectedCollection={selectedCollection}
              onCollectionSelect={onCollectionSelect}
              setRightClickCollection={setRightClickCollection}
              renameCollectionDisclosure={renameCollectionDisclosure}
              moveCollectionDisclosure={moveCollectionDisclosure}
              deleteCollectionDisclosure={deleteCollectionDisclosure}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default Sidebar;
