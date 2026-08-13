import {addToast, Spacer, useDisclosure} from "@heroui/react";
import React, {JSX, useState} from "react";
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

  const onCollectionSelect = (collection: Collection) => {
    // Only clear asset selection when switching to a DIFFERENT collection
    if (selectedCollection?.id !== collection.id) {
      setSelectedAssets([]);
    }

    // If components already loaded, just select
    if (collection.assets != null) {
      setSelectedCollection(collection);
    } else {
      queryCollection(collection.id, () => {
        addToast({
          title: "Error",
          description: `Failed to load the contents of collection ${collection.label} (ID ${collection.id})`,
          color: "danger",
          timeout: 5000,
          shouldShowTimeoutProgress: true,
        });
      }).then((assets) => {
        collection.assets = assets;
        setSelectedCollection({...collection, assets});
      });
    }
  };

  const renameCollectionDisclosure: Disclosure = useDisclosure();
  const moveCollectionDisclosure: Disclosure = useDisclosure();
  const deleteCollectionDisclosure: Disclosure = useDisclosure();

  return (
    <div className="flex flex-col min-w-fit bg-background/50 overflow-auto scrollbar-hide">
      <div className="p-4 pt-2">
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

        <Spacer className="h-0.5"/>
        <NewCollectionButton />
      </div>
    </div>
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
  const [expanded, setExpanded] = useState(false);

  return (
    <li key={collection.id}>
      <CollectionButton
        expanded={expanded}
        collection={collection}
        selectedCollection={selectedCollection}
        onCollectionSelect={(col: Collection) => {
          if (col.children && col.children.length > 0) setExpanded((prev) => !prev);
          onCollectionSelect(col);
        }}
        setRightClickCollection={setRightClickCollection}
        renameCollectionDisclosure={renameCollectionDisclosure}
        moveCollectionDisclosure={moveCollectionDisclosure}
        deleteCollectionDisclosure={deleteCollectionDisclosure}
      />

      {expanded && collection.children && collection.children.length > 0 && (
        <div className="flex flex-row">
          {Array(depth).fill(null).map((_, i) => (
            <span key={i} className="self-stretch w-[2px] bg-default-300 dark:bg-default-200 mx-2 mt-1" />
          ))}

          <ul id={collection.id} className="flex-grow space-y-1 mt-1">
            {collection.children.map((child) => (
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
        </div>
      )}
    </li>
  );
};

export default Sidebar;
