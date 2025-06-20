import ImageCardContainer from "../common/ImageCardContainer.tsx";


function Filmstrip() {
  return (
    <div className="flex flex-col bg-default-100" style={{ zoom: (window.innerHeight <= 800 ? "0.6" : "0.8") }}>
      <div className="flex flex-row">
        <ImageCardContainer className="flex flex-row w-full overflow-scroll gap-8 p-8"/>
      </div>
    </div>
  )
}

export default Filmstrip