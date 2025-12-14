import Filmstrip from "./filmstrip/Filmstrip.tsx";
import Lightbox from "./Lightbox.tsx";
import {useRef} from "react";


function LightboxView() {

  const filmstripScroll = useRef<HTMLUListElement>(null);

  return (
    <div className="flex flex-col flex-grow">
      <Lightbox scrollRef={filmstripScroll} />
      <Filmstrip scrollRef={filmstripScroll} />
    </div>
  )
}

export default LightboxView