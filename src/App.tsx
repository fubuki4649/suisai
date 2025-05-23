import {cn, HeroUIProvider, ToastProvider} from "@heroui/react";
import React, {useEffect} from "react";
import Header from "./ui/global_elements/Header.tsx";
import Sidebar from "./ui/global_elements/sidebar/Sidebar.tsx";
import ThumbnailView from "./ui/thumbnail_view/ThumbnailView.tsx";
import {useAlbums, useDarkMode} from "./models/GlobalContext.tsx";
import {getAlbums} from "./api/Album.ts";
import {Album} from "./models/model.ts";


function App() {

  const [darkMode] = useDarkMode();
  const [, setAlbums] = useAlbums();

  // Update cards on album change/load
  useEffect(() => {
    getAlbums().then((albums: Album[]) => {
      setAlbums(albums);
    })
  }, []);

  return (
      <HeroUIProvider>
        <ToastProvider  placement="bottom-center"/>
        <main className={cn(darkMode && "dark text-foreground", "h-screen flex flex-col bg-default")}>
          <Header />
          <div className="flex flex-row flex-grow">
            <Sidebar />
            <ThumbnailView/>
          </div>
        </main>
      </HeroUIProvider>
  )
}

export default App
