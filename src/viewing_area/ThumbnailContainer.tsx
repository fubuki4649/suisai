import React, {useRef} from "react";
import ThumbnailCard from "./ThumbnailCard.tsx";


function ThumbnailContainer() {

  return (
    <div className="flex flex-wrap flex-grow content-start gap-6 p-6 grid-cols-auto">

      <ThumbnailCard/>
      <ThumbnailCard/>
      <ThumbnailCard/>
      <ThumbnailCard/>
      <ThumbnailCard/>
      <ThumbnailCard/>

    </div>
  )
}

export default ThumbnailContainer
