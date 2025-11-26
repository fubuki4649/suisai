import {cn, HeroUIProvider, ToastProvider} from "@heroui/react";
import React, {useEffect} from "react";
import Header from "./ui/layouts/Header.tsx";
import Sidebar from "./ui/layouts/sidebar/Sidebar.tsx";
import ThumbnailView from "./ui/layouts/ThumbnailView.tsx";
import {useAlbums, useDarkMode} from "./models/GlobalContext.tsx";
import {getRootAlbums} from "./api/endpoints/album.ts";
import {Album} from "./models/model.ts";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import FilmstripView from "./ui/layouts/FilmstripView.tsx";


function App() {

  const [darkMode] = useDarkMode();
  const [, setAlbums] = useAlbums();

  // Update cards on album change/load
  useEffect(() => {
    getRootAlbums().then((albums: Album[]) => {
      setAlbums(albums);
    })
  }, []);

  return (
      <HeroUIProvider>
        <ToastProvider placement="bottom-center"/>
        <BrowserRouter>
          <main className={cn(darkMode && "dark text-foreground", "h-screen flex flex-col bg-default")}>
            <Header />
            <div className="flex flex-row flex-grow overflow-y-auto">
              <Sidebar />
              <Routes>
                <Route path="/" element={<ThumbnailView/>} />
                <Route path="/film" element={<FilmstripView />} />
              </Routes>
            </div>
          </main>
        </BrowserRouter>
      </HeroUIProvider>
  )
}

export default App
