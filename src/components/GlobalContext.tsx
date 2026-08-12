import {createContext, ReactNode, useContext, useState} from "react";
import {Asset, Collection} from "../api/models.ts";

type GlobalState = {
  collections: Collection[];
  setCollections: (collections: Collection[]) => void;

  darkMode: boolean;
  setDarkMode: (value: boolean) => void;

  selectedCollection: Collection | null;
  setSelectedCollection: (collection: Collection | null) => void;

  selectedAssets: Asset[];
  setSelectedAssets: (assets: Asset[]) => void;
};

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);

  const store: GlobalState = {
    collections,
    setCollections,
    darkMode,
    setDarkMode,
    selectedCollection,
    setSelectedCollection,
    selectedAssets,
    setSelectedAssets,
  };

  return (
    <GlobalContext.Provider value={store}>
      {children}
    </GlobalContext.Provider>
  );
};

// Primary useGlobalContext if you want full access
const useGlobalContext = (): GlobalState => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalContextProvider");
  }
  return context;
};

// Scoped hooks
export const useCollections = (): [Collection[], (collections: Collection[]) => void] => {
  const { collections, setCollections } = useGlobalContext();
  return [collections, setCollections];
};

export const useDarkMode = (): [boolean, (darkMode: boolean) => void] => {
  const { darkMode, setDarkMode } = useGlobalContext();
  return [darkMode, setDarkMode];
};

export const useSelectedCollection = (): [Collection | null, (collection: Collection | null) => void] => {
  const { selectedCollection, setSelectedCollection } = useGlobalContext();
  return [selectedCollection, setSelectedCollection];
};

export const useSelectedAssets = (): [Asset[], (assets: Asset[]) => void] => {
  const { selectedAssets, setSelectedAssets } = useGlobalContext();
  return [selectedAssets, setSelectedAssets];
};

// Backwards compatibility hooks
export const useAlbums = useCollections;
export const useSelectedAlbum = useSelectedCollection;
export const useSelectedPhotos = useSelectedAssets;
