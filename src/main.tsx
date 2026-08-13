import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {GalleryContextProvider} from "./context/GalleryContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GalleryContextProvider>
      <App />
    </GalleryContextProvider>
  </StrictMode>,
);
