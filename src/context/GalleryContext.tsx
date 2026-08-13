/* eslint-disable react-refresh/only-export-components */
import React, {createContext, ReactNode, useContext, useState} from "react";
import {Asset, Collection} from "../types/models.ts";

type GalleryState = {
  collections: Collection[];
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;

  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;

  selectedCollection: Collection | null;
  setSelectedCollection: React.Dispatch<React.SetStateAction<Collection | null>>;

  selectedAssets: Asset[];
  setSelectedAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
};

const GalleryContext = createContext<GalleryState | undefined>(undefined);

export const GalleryContextProvider = ({ children }: { children: ReactNode }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);

  const store: GalleryState = {
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
    <GalleryContext.Provider value={store}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGalleryContext = (): GalleryState => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error("useGalleryContext must be used within a GalleryContextProvider");
  }
  return context;
};

export const useCollections = (): [Collection[], React.Dispatch<React.SetStateAction<Collection[]>>] => {
  const { collections, setCollections } = useGalleryContext();
  return [collections, setCollections];
};

export const useDarkMode = (): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const { darkMode, setDarkMode } = useGalleryContext();
  return [darkMode, setDarkMode];
};

export const useSelectedCollection = (): [Collection | null, React.Dispatch<React.SetStateAction<Collection | null>>] => {
  const { selectedCollection, setSelectedCollection } = useGalleryContext();
  return [selectedCollection, setSelectedCollection];
};

export const useSelectedAssets = (): [Asset[], React.Dispatch<React.SetStateAction<Asset[]>>] => {
  const { selectedAssets, setSelectedAssets } = useGalleryContext();
  return [selectedAssets, setSelectedAssets];
};
