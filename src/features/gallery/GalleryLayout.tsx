import React, {useEffect} from "react";
import {Outlet} from "react-router-dom";
import {useCollections, useSelectedCollection} from "../../context/GalleryContext.tsx";
import {getCollections, queryCollection} from "../../api/collections.ts";
import {Collection} from "../../types/models.ts";
import Sidebar from "./sidebar/Sidebar.tsx";

export function GalleryLayout() {
  const [collections, setCollections] = useCollections();
  const [selectedCollection, setSelectedCollection] = useSelectedCollection();

  // Load collections on initial mount if empty, and default to "Unfiled Assets"
  useEffect(() => {
    if (collections.length === 0) {
      getCollections().then((fetchedCollections: Collection[]) => {
        setCollections(fetchedCollections);

        const unfiled = fetchedCollections.find((c) => c.id === "-1") ?? fetchedCollections[0];
        if (unfiled && !selectedCollection) {
          queryCollection(unfiled.id).then((assets) => {
            unfiled.assets = assets;
            setSelectedCollection({...unfiled, assets});
          });
        }
      });
    }
  }, [collections.length, setCollections, selectedCollection, setSelectedCollection]);

  return (
    <div className="flex flex-row flex-grow min-h-0 overflow-hidden">
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default GalleryLayout;
