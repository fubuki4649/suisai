import {Toast} from "@heroui/react";
import React, {Suspense, lazy} from "react";
import Header from "./components/Header.tsx";
import ServerOfflineModal from "./components/ServerOfflineModal.tsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import GalleryLayout from "./features/gallery/GalleryLayout.tsx";

const GridView = lazy(() => import("./features/gallery/views/GridView.tsx"));
const LightboxView = lazy(() => import("./features/gallery/views/LightboxView.tsx"));

function App() {

  return (
    <>
      <Toast.Provider placement="bottom" />
      <ServerOfflineModal />
      <BrowserRouter>
        <main className="h-screen flex flex-col bg-background text-foreground">
          <Header />
          <div className="flex flex-row flex-grow min-h-0 overflow-hidden">
            <Suspense fallback={<div className="flex flex-grow items-center justify-center" />}>
              <Routes>
                <Route path="/" element={<Navigate to="/gallery" replace />} />
                <Route path="/gallery" element={<GalleryLayout />}>
                  <Route index element={<GridView />} />
                  <Route path="lightbox" element={<LightboxView />} />
                </Route>
              </Routes>
            </Suspense>
          </div>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;
