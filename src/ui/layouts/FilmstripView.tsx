import Filmstrip from "../components/filmstrip/Filmstrip.tsx";
import Lightbox from "../components/Lightbox.tsx";
import {useRef} from "react";


function FilmstripView() {

  const filmstripScroll = useRef<HTMLUListElement>(null);

  return (
    <div className="flex flex-col flex-grow">
      <Lightbox scrollRef={filmstripScroll} />
      <Filmstrip scrollRef={filmstripScroll} />
    </div>
  )
}

export default FilmstripView