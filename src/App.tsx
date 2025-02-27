import {HeroUIProvider} from "@heroui/react";
import React, {useState} from "react";
import clsx from 'clsx';
import Header from "./Header.tsx";
import Sidebar from "./Sidebar.tsx";
import ThumbnailCard from "./viewing_area/ThumbnailCard.tsx";
import ThumbnailContainer from "./viewing_area/ThumbnailContainer.tsx";


function App() {
  const [darkMode] = useState(true)

  return (
    <HeroUIProvider>
      <main className={clsx(darkMode && "dark text-foreground", "h-screen flex flex-col")}>
        <Header />
        <div className="flex flex-row flex-grow">
          <Sidebar />
          <ThumbnailContainer />
        </div>
      </main>
    </HeroUIProvider>
  )
}

export default App
