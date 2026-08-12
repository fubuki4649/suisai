import React, {ReactNode, useEffect} from "react";
import {useCollections} from "../../components/GlobalContext.tsx";
import {getCollections} from "../../api/endpoints/album.ts";
import {Collection} from "../../api/models.ts";
import Sidebar from "./album_rail/Sidebar.tsx";

export default function Gallery ({ children }: { children: ReactNode }) {
  const [, setCollections] = useCollections();

  // Update collections on load
  useEffect(() => {
    getCollections().then((collections: Collection[]) => {
      setCollections(collections);
    });
  }, [setCollections]);

  return (
    <div className="flex flex-row flex-grow overflow-y-auto">
      <Sidebar />
      { children }
    </div>
  );
}
