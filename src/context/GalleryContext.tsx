/* eslint-disable react-refresh/only-export-components */
import React, {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {Asset, Collection} from "../types/models.ts";

export type ThemeMode = "light" | "dark" | "auto";

export type ThemeState = {
  themeMode: ThemeMode;
  setThemeMode: React.Dispatch<React.SetStateAction<ThemeMode>>;
  isDark: boolean;
};

export type CollectionsState = {
  collections: Collection[];
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
  selectedCollection: Collection | null;
  setSelectedCollection: React.Dispatch<React.SetStateAction<Collection | null>>;
};

export type AssetSelectionState = {
  selectedAssets: Asset[];
  setSelectedAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
};



const ThemeContext = createContext<ThemeState | undefined>(undefined);
const CollectionsContext = createContext<CollectionsState | undefined>(undefined);
const AssetSelectionContext = createContext<AssetSelectionState | undefined>(undefined);

export const THEME_STORAGE_KEY = "suisai_theme_mode";

export const GalleryContextProvider = ({ children }: { children: ReactNode }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "light" || saved === "dark" || saved === "auto") {
        return saved;
      }
    }
    return "auto";
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    }
  }, [themeMode]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const isDark = themeMode === "auto" ? systemIsDark : themeMode === "dark";

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [isDark]);

  const themeValue = useMemo<ThemeState>(
    () => ({ themeMode, setThemeMode, isDark }),
    [themeMode, isDark]
  );

  const collectionsValue = useMemo<CollectionsState>(
    () => ({ collections, setCollections, selectedCollection, setSelectedCollection }),
    [collections, selectedCollection]
  );

  const selectionValue = useMemo<AssetSelectionState>(
    () => ({ selectedAssets, setSelectedAssets }),
    [selectedAssets]
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <CollectionsContext.Provider value={collectionsValue}>
        <AssetSelectionContext.Provider value={selectionValue}>
          {children}
        </AssetSelectionContext.Provider>
      </CollectionsContext.Provider>
    </ThemeContext.Provider>
  );
};

export const useThemeState = (): ThemeState => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeState must be used within a GalleryContextProvider");
  }
  return context;
};

export const useCollectionsState = (): CollectionsState => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error("useCollectionsState must be used within a GalleryContextProvider");
  }
  return context;
};

export const useAssetSelectionState = (): AssetSelectionState => {
  const context = useContext(AssetSelectionContext);
  if (!context) {
    throw new Error("useAssetSelectionState must be used within a GalleryContextProvider");
  }
  return context;
};


export const useCollections = (): [Collection[], React.Dispatch<React.SetStateAction<Collection[]>>] => {
  const { collections, setCollections } = useCollectionsState();
  return [collections, setCollections];
};

export const useThemeMode = (): [ThemeMode, React.Dispatch<React.SetStateAction<ThemeMode>>] => {
  const { themeMode, setThemeMode } = useThemeState();
  return [themeMode, setThemeMode];
};


export const useSelectedCollection = (): [Collection | null, React.Dispatch<React.SetStateAction<Collection | null>>] => {
  const { selectedCollection, setSelectedCollection } = useCollectionsState();
  return [selectedCollection, setSelectedCollection];
};

export const useSelectedAssets = (): [Asset[], React.Dispatch<React.SetStateAction<Asset[]>>] => {
  const { selectedAssets, setSelectedAssets } = useAssetSelectionState();
  return [selectedAssets, setSelectedAssets];
};

