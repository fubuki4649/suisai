import {cn, toast, useOverlayState} from "@heroui/react";
import React, {JSX, useCallback, useState} from "react";
import {useCollections, useSelectedAssets, useSelectedCollection} from "../../../context/GalleryContext.tsx";
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

  // Set of expanded collection IDs - starts completely un-expanded on initial load
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Helper to gather all descendant collection IDs recursively
  const getDescendantIds = useCallback((col: Collection): string[] => {
    let ids: string[] = [col.id];
    if (col.children) {
      for (const child of col.children) {
        ids = ids.concat(getDescendantIds(child));
      }
    }
    return ids;
  }, []);

  // Expand single collection
  const expandCollection = useCallback((id: string) => {
    setExpandedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // Collapse a collection AND all its descendants recursively on double-click
  const collapseCollectionRecursively = useCallback(
    (col: Collection) => {
      const toRemove = new Set(getDescendantIds(col));
      setExpandedIds((prev) => {
        const next = new Set(prev);
        toRemove.forEach((id) => next.delete(id));
        return next;
      });
    },
    [getDescendantIds]
  );

  // Toggle single collection expansion via chevron click
  const toggleExpand = useCallback(
    (col: Collection) => {
      setExpandedIds((prev) => {
        if (prev.has(col.id)) {
          const toRemove = new Set(getDescendantIds(col));
          const next = new Set(prev);
          toRemove.forEach((id) => next.delete(id));
          return next;
        } else {
          const next = new Set(prev);
          next.add(col.id);
          return next;
        }
      });
    },
    [getDescendantIds]
  );

  // Resizable width state with localStorage persistence
  const MIN_SIDEBAR_WIDTH = 200;
  const MAX_SIDEBAR_WIDTH = 500;
  const DEFAULT_SIDEBAR_WIDTH = 240;

  const [width, setWidth] = useState<number>(() => {
    const saved = localStorage.getItem("suisai_sidebar_width");
    return saved
      ? Math.max(MIN_SIDEBAR_WIDTH, Math.min(MAX_SIDEBAR_WIDTH, parseInt(saved, 10)))
      : DEFAULT_SIDEBAR_WIDTH;
  });
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const startX = e.clientX;
      const startWidth = width;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = Math.min(
          Math.max(MIN_SIDEBAR_WIDTH, startWidth + (moveEvent.clientX - startX)),
          MAX_SIDEBAR_WIDTH
        );
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

    // Expand on click if it has children
    if (collection.children && collection.children.length > 0) {
      expandCollection(collection.id);
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
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              collapseCollectionRecursively={collapseCollectionRecursively}
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
  expandedIds,
  toggleExpand,
  collapseCollectionRecursively,
  selectedCollection,
  onCollectionSelect,
  setRightClickCollection,
  renameCollectionDisclosure,
  moveCollectionDisclosure,
  deleteCollectionDisclosure,
}: {
  depth: number;
  collection: Collection;
  expandedIds: Set<string>;
  toggleExpand: (col: Collection) => void;
  collapseCollectionRecursively: (col: Collection) => void;
  selectedCollection: Collection | null;
  onCollectionSelect: (collection: Collection) => void;
  setRightClickCollection: (collection: Collection) => void;
  renameCollectionDisclosure: Disclosure;
  moveCollectionDisclosure: Disclosure;
  deleteCollectionDisclosure: Disclosure;
}): JSX.Element => {
  const isExpanded = expandedIds.has(collection.id);
  const hasChildren = Boolean(collection.children && collection.children.length > 0);

  return (
    <li key={collection.id} className="relative">
      <CollectionButton
        expanded={isExpanded}
        hasChildren={hasChildren}
        onToggleExpand={(e) => {
          e.stopPropagation();
          toggleExpand(collection);
        }}
        onCollapseRecursively={collapseCollectionRecursively}
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

      {isExpanded && hasChildren && (
        <ul className="ml-4 pl-2 border-l border-separator mt-1">
          {collection.children!.map((child) => (
            <ShowCollection
              depth={depth + 1}
              key={child.id}
              collection={child}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              collapseCollectionRecursively={collapseCollectionRecursively}
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
