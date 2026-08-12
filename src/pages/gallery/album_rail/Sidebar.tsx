import {addToast, Spacer, useDisclosure} from "@heroui/react";
import React, {JSX, useState} from "react";
import {useCollections, useSelectedCollection, useSelectedAssets} from "../../../components/GlobalContext.tsx";
import NewAlbumBtn from "./NewAlbumBtn.tsx";
import AlbumButton from "./AlbumButton.tsx";
import RenameAlbumModal from "./album_modals/RenameAlbumModal.tsx";
import DeleteAlbumModal from "./album_modals/DeleteAlbumModal.tsx";
import {Disclosure} from "../../../components/modal-disclosure.ts";
import {queryCollection} from "../../../api/endpoints/collection.ts";
import {Collection} from "../../../api/models.ts";
import MoveAlbumModal from "./album_modals/MoveAlbumModal.tsx";

function Sidebar() {
  const [collections] = useCollections();
  const [selectedCollection, setSelectedCollection] = useSelectedCollection();
  const [, setSelectedAssets] = useSelectedAssets();

  // Stores state for the modal dialogues
  const [rightClickCollection, setRightClickCollection] = useState<Collection | null>(null);

  // Hook for selecting a collection
  const onCollectionSelect = (collection: Collection) => {
    // Only reset asset selection when switching to a different collection
    if (selectedCollection?.id !== collection.id) {
      setSelectedAssets([]);
    }

    // If collection has already been loaded, select collection
    if (collection.assets != null) {
      setSelectedCollection(collection);
    }
    // Otherwise, load collection (contents), then select collection
    else {
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
            <RenameAlbumModal disclosure={renameCollectionDisclosure} collection={rightClickCollection} />
            <MoveAlbumModal disclosure={moveCollectionDisclosure} collection={rightClickCollection} />
            <DeleteAlbumModal disclosure={deleteCollectionDisclosure} collection={rightClickCollection} />
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
        <NewAlbumBtn />
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
      {/* Display Collection Button */}
      <AlbumButton
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

      {/* Display Collection Children */}
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
