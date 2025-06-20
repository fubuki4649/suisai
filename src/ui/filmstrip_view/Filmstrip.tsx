import ImageCardContainer from "../common/ImageCardContainer.tsx";
import React from "react";


function Filmstrip() {
  return (
    <div className="flex flex-col bg-default-100 shadow-2xl" style={{ zoom: (window.innerHeight <= 800 ? "0.6" : "0.8") }}>
      <div className="flex flex-row min-h-48">
        <ImageCardContainer className="flex flex-row w-full overflow-scroll gap-6 p-6"/>
      </div>
    </div>
  )
}

export default Filmstrip