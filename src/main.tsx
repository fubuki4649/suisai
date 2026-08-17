import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {GalleryContextProvider} from "./context/GalleryContext.tsx";
import {ServerHealthProvider} from "./context/ServerHealthContext.tsx";
import {addCollection} from "@iconify/react";
import {icons as gravityUiIcons} from "@iconify-json/gravity-ui";

// Register Gravity UI icons locally for zero-latency offline static bundling
addCollection(gravityUiIcons);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ServerHealthProvider>
      <GalleryContextProvider>
        <App />
      </GalleryContextProvider>
    </ServerHealthProvider>
  </StrictMode>,
);
