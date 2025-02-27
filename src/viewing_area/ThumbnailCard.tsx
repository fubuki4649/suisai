import {Card, Image} from "@heroui/react";
import React from "react";


function ThumbnailCard() {
  return (
    <Card shadow="sm" className="h-fit w-fit">
      <Image
        alt="Card background"
        className="rounded-xl"
        src="https://heroui.com/images/hero-card-complete.jpeg"
        width={270}
      />
    </Card>
  )
}

export default ThumbnailCard
