/* eslint-disable react-refresh/only-export-components */
import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Asset, Collection} from "../types/models.ts";

export type ThemeMode = "light" | "dark" | "auto";

type GalleryState = {
  collections: Collection[];
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;

  themeMode: ThemeMode;
  setThemeMode: React.Dispatch<React.SetStateAction<ThemeMode>>;
  isDark: boolean;

  selectedCollection: Collection | null;
  setSelectedCollection: React.Dispatch<React.SetStateAction<Collection | null>>;

  selectedAssets: Asset[];
  setSelectedAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
};

const GalleryContext = createContext<GalleryState | undefined>(undefined);

export const GalleryContextProvider = ({ children }: { children: ReactNode }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [themeMode, setThemeMode] = useState<ThemeMode>("auto");
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);

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

  const store: GalleryState = {
    collections,
    setCollections,
    themeMode,
    setThemeMode,
    isDark,
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

export const useThemeMode = (): [ThemeMode, React.Dispatch<React.SetStateAction<ThemeMode>>] => {
  const { themeMode, setThemeMode } = useGalleryContext();
  return [themeMode, setThemeMode];
};

export const useIsDark = (): boolean => {
  const { isDark } = useGalleryContext();
  return isDark;
};

export const useDarkMode = (): [boolean, React.Dispatch<React.SetStateAction<ThemeMode>>] => {
  const { isDark, setThemeMode } = useGalleryContext();
  return [isDark, setThemeMode];
};

export const useSelectedCollection = (): [Collection | null, React.Dispatch<React.SetStateAction<Collection | null>>] => {
  const { selectedCollection, setSelectedCollection } = useGalleryContext();
  return [selectedCollection, setSelectedCollection];
};

export const useSelectedAssets = (): [Asset[], React.Dispatch<React.SetStateAction<Asset[]>>] => {
  const { selectedAssets, setSelectedAssets } = useGalleryContext();
  return [selectedAssets, setSelectedAssets];
};
