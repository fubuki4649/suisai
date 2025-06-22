import Filmstrip from "./Filmstrip.tsx";
import BigScreen from "./BigScreen.tsx";


function FilmstripView() {
  return (
    <div className="flex flex-col flex-grow" style={{ zoom: (window.innerHeight <= 800 ? "0.825" : "1.0") }}>
      <BigScreen/>
      <Filmstrip/>
    </div>
  )
}

export default FilmstripView