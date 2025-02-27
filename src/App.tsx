import {HeroUIProvider} from "@heroui/react";
import React, {useState} from "react";
import clsx from 'clsx';
import Header from "./Header.tsx";
import Sidebar from "./Sidebar.tsx";
import PhotoCard from "./viewing_area/PhotoCard.tsx";


function App() {
  const [darkMode] = useState(true)

  return (
    <HeroUIProvider>
      <main className={clsx(darkMode && "dark text-foreground", "h-screen flex flex-col")}>

        <Header />

        <div className="flex flex-row flex-grow">


          <Sidebar />

          <div style={{background: "red"}}>

            <PhotoCard />
          </div>

        </div>


      </main>
    </HeroUIProvider>
  )
}

export default App
