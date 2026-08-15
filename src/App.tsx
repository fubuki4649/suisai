import {cn, Toast} from "@heroui/react";
import React from "react";
import Header from "./components/Header.tsx";
import {useIsDark} from "./context/GalleryContext.tsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import GalleryLayout from "./features/gallery/GalleryLayout.tsx";
import GridView from "./features/gallery/views/GridView.tsx";
import LightboxView from "./features/gallery/views/LightboxView.tsx";

function App() {
  const isDark = useIsDark();

  return (
    <>
      <Toast.Provider placement="bottom" />
      <BrowserRouter>
        <main className={cn(isDark && "dark", "h-screen flex flex-col bg-background text-foreground")}>
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
    </>
  );
}

export default App;
