import React, {useEffect} from "react";
import {toast} from "@heroui/react";
import {Outlet} from "react-router-dom";
import {useCollections, useSelectedCollection} from "../../context/GalleryContext.tsx";
import {getCollections, queryCollection} from "../../api/collections.ts";
import {Collection} from "../../types/models.ts";
import Sidebar from "./sidebar/Sidebar.tsx";

function GalleryLayout() {
  const [collections, setCollections] = useCollections();
  const [, setSelectedCollection] = useSelectedCollection();

  // Load collections on initial mount if empty, and default to "Unfiled Assets"
  useEffect(() => {
    if (collections.length === 0) {
      getCollections((code) => toast.danger("Error", {description: `Failed to load collections (code ${code})`}))
        .then((fetchedCollections: Collection[]) => {
          setCollections(fetchedCollections);
          const unfiled = fetchedCollections.find((c) => c.id === "-1") ?? fetchedCollections[0];
          if (unfiled) {
            queryCollection(unfiled.id).then((assets) => setSelectedCollection({...unfiled, assets}));
          }
        });
    }
  }, [collections.length, setCollections, setSelectedCollection]);

  return (
    <div className="flex flex-row flex-grow min-h-0 overflow-hidden">
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default GalleryLayout;
