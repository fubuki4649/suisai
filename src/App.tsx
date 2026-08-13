import {cn, HeroUIProvider, ToastProvider} from "@heroui/react";
import React from "react";
import Header from "./components/Header.tsx";
import {useDarkMode} from "./context/GalleryContext.tsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import GalleryLayout from "./features/gallery/GalleryLayout.tsx";
import GridView from "./features/gallery/views/GridView.tsx";
import LightboxView from "./features/gallery/views/LightboxView.tsx";

function App() {
  const [darkMode] = useDarkMode();

  return (
    <HeroUIProvider>
      <ToastProvider placement="bottom-center"/>
      <BrowserRouter>
        <main className={cn(darkMode && "dark text-foreground", "h-screen flex flex-col bg-default")}>
          <Header />
          <div className="flex flex-row flex-grow overflow-y-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/gallery" replace />} />
              <Route path="/gallery" element={<GalleryLayout />}>
                <Route index element={<GridView />} />
                <Route path="lightbox" element={<LightboxView />} />
              </Route>
            </Routes>
          </div>
        </main>
      </BrowserRouter>
    </HeroUIProvider>
  );
}

export default App;
