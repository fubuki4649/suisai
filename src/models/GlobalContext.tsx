import {createContext, ReactNode, useContext, useState} from "react";
import type {Album, Photo} from "./model.ts";

type GlobalState = {
  albums: Album[];
  setAlbums: (albums: Album[]) => void;

  darkMode: boolean;
  setDarkMode: (value: boolean) => void;

  selectedAlbum: Album | null;
  setSelectedAlbum: (album: Album | null) => void;

  selectedPhotos: Photo[];
  setSelectedPhotos: (card: Photo[]) => void;
};

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([]);

  const store: GlobalState = {
    albums,
    setAlbums,
    darkMode,
    setDarkMode,
    selectedAlbum,
    setSelectedAlbum,
    selectedPhotos,
    setSelectedPhotos,
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

// Smaller scoped hooks
export const useAlbums = (): [Album[], (albums: Album[]) => void] => {
  const { albums, setAlbums } = useGlobalContext();
  return [albums, setAlbums];
};

export const useDarkMode = (): [boolean, (darkMode: boolean) => void] => {
  const { darkMode, setDarkMode } = useGlobalContext();
  return [darkMode, setDarkMode];
};

export const useSelectedAlbum = (): [Album | null, (album: Album | null) => void] => {
  const { selectedAlbum, setSelectedAlbum } = useGlobalContext();
  return [selectedAlbum, setSelectedAlbum];
};

export const useSelectedPhotos = (): [Photo[], (photos: Photo[]) => void] => {
  const { selectedPhotos, setSelectedPhotos } = useGlobalContext();
  return [selectedPhotos, setSelectedPhotos];
};
