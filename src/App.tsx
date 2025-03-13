import {HeroUIProvider} from "@heroui/react";
import React, {useState} from "react";
import clsx from 'clsx';
import Header from "./global_elements/Header.tsx";
import Sidebar from "./global_elements/Sidebar.tsx";
import ThumbnailContainer from "./thumbnail_view/ThumbnailContainer.tsx";
import {getAlbums} from "./model/endpoints.ts";
import {Album} from "./model/objects.ts";


function App() {

  const albums: Album[] = getAlbums()

  const [darkMode, setDarkMode] = useState<boolean>(true)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)

  return (
    <HeroUIProvider>
      <main className={clsx(darkMode && "dark text-foreground", "h-screen flex flex-col bg-default")}>
        <Header darkModeHandler={() => setDarkMode(!darkMode)} />
        <div className="flex flex-row flex-grow">
          <Sidebar albums={albums} selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum} />
          <ThumbnailContainer album={selectedAlbum}/>
        </div>
      </main>
    </HeroUIProvider>
  )
}

export default App
