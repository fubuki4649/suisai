import Filmstrip from "./Filmstrip.tsx";
import Lightbox from "./Lightbox.tsx";
import {useRef} from "react";


function FilmstripView() {

  const filmstripScroll = useRef<HTMLUListElement>(null);

  return (
    <div className="flex flex-col flex-grow" style={{ zoom: (window.innerHeight <= 800 ? "0.825" : "1.0") }}>
      <Lightbox scrollRef={filmstripScroll}/>
      <Filmstrip scrollRef={filmstripScroll}/>
    </div>
  )
}

export default FilmstripView