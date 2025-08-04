import Filmstrip from "./Filmstrip.tsx";
import Lightbox from "./Lightbox.tsx";
import {useRef} from "react";
import DataStrip from "./DataStrip.tsx";


function FilmstripView() {

  const filmstripScroll = useRef<HTMLUListElement>(null);

  return (
    <div className="flex flex-col flex-grow">
      <Lightbox scrollRef={filmstripScroll} />
      <DataStrip />
      <Filmstrip scrollRef={filmstripScroll} />
    </div>
  )
}

export default FilmstripView