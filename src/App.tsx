import {HeroUIProvider} from "@heroui/react";
import React, {useState} from "react";
import clsx from 'clsx';
import Header from "./global_elements/Header.tsx";
import Sidebar from "./global_elements/Sidebar.tsx";
import ThumbnailContainer from "./thumbnail_view/ThumbnailContainer.tsx";


function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true)

  return (
    <HeroUIProvider>
      <main className={clsx(darkMode && "dark text-foreground", "h-screen flex flex-col bg-default")}>
        <Header darkModeHandler={() => setDarkMode(!darkMode)} />
        <div className="flex flex-row flex-grow">
          <Sidebar />
          <ThumbnailContainer />
        </div>
      </main>
    </HeroUIProvider>
  )
}

export default App
