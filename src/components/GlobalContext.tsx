/* eslint-disable react-refresh/only-export-components */
import React, {createContext, ReactNode, useContext, useState} from "react";
import {Asset, Collection} from "../api/models.ts";

type GlobalState = {
  collections: Collection[];
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;

  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;

  selectedCollection: Collection | null;
  setSelectedCollection: React.Dispatch<React.SetStateAction<Collection | null>>;

  selectedAssets: Asset[];
  setSelectedAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
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

export const useGlobalContext = (): GlobalState => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalContextProvider");
  }
  return context;
};

export const useCollections = (): [Collection[], React.Dispatch<React.SetStateAction<Collection[]>>] => {
  const { collections, setCollections } = useGlobalContext();
  return [collections, setCollections];
};

export const useDarkMode = (): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const { darkMode, setDarkMode } = useGlobalContext();
  return [darkMode, setDarkMode];
};

export const useSelectedCollection = (): [Collection | null, React.Dispatch<React.SetStateAction<Collection | null>>] => {
  const { selectedCollection, setSelectedCollection } = useGlobalContext();
  return [selectedCollection, setSelectedCollection];
};

export const useSelectedAssets = (): [Asset[], React.Dispatch<React.SetStateAction<Asset[]>>] => {
  const { selectedAssets, setSelectedAssets } = useGlobalContext();
  return [selectedAssets, setSelectedAssets];
};
