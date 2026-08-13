import React, {useEffect} from "react";
import {Outlet} from "react-router-dom";
import {useCollections} from "../../context/GalleryContext.tsx";
import {getCollections} from "../../api/collections.ts";
import {Collection} from "../../types/models.ts";
import Sidebar from "./sidebar/Sidebar.tsx";

export function GalleryLayout() {
  const [collections, setCollections] = useCollections();

  // Load collections on initial mount if empty
  useEffect(() => {
    if (collections.length === 0) {
      getCollections().then((fetchedCollections: Collection[]) => {
        setCollections(fetchedCollections);
      });
    }
  }, [collections.length, setCollections]);

  return (
    <div className="flex flex-row flex-grow overflow-y-auto">
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default GalleryLayout;
