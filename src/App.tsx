import {cn, HeroUIProvider} from "@heroui/react";
import React, {useEffect, useState} from "react";
import Header from "./global_elements/Header.tsx";
import Sidebar from "./global_elements/Sidebar.tsx";
import ThumbnailContainer from "./thumbnail_view/ThumbnailContainer.tsx";
import {getAlbums} from "./api/Album.ts";
import {Album} from "./model/models.ts";


function App() {

  useEffect(() => {
    getAlbums().then((albums: Album[]) => {
      console.log(albums);
      setAlbums(albums);
    })
  }, []);

  const [albums, setAlbums] = useState<Album[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(true)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)

  return (
    <HeroUIProvider>
      <main className={cn(darkMode && "dark text-foreground", "h-screen flex flex-col bg-default")}>
        <Header darkMode={darkMode} darkModeHandler={setDarkMode} />
        <div className="flex flex-row flex-grow">
          <Sidebar albums={albums} selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum} />
          <ThumbnailContainer album={selectedAlbum}/>
        </div>
      </main>
    </HeroUIProvider>
  )
}

export default App
