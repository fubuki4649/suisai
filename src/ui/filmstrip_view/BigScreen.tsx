import {useSelectedPhotos} from "../../models/GlobalContext.tsx";


function BigScreen() {

  const [selectedPhotos] = useSelectedPhotos();

  return (
    <div className="flex flex-grow overflow-auto justify-center">
      <img className="object-scale-down shadow-2xl" src={`http://localhost:8000/api/thumbnail/${selectedPhotos[0]?.hash}`} alt="" />
    </div>
  )
}

export default BigScreen