import Filmstrip from "./Filmstrip.tsx";
import BigScreen from "./BigScreen.tsx";


function FilmstripView() {
  return (
    <div className="flex flex-col flex-grow">
      <BigScreen/>
      <Filmstrip/>
    </div>
  )
}

export default FilmstripView