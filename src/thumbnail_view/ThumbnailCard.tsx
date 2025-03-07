import {Card, CardFooter, Image} from "@heroui/react";
import React from "react";
import {ThumbnailCardProps} from "./ViewModel.ts";


function ThumbnailCard(props: ThumbnailCardProps) {

  const handleClick = () => {
    console.log("Click");
    props.onClick(props.id);
  };

  return (
    <Card isPressable onPress={handleClick} shadow="sm" className="h-fit w-fit">
      <Image
        alt="Card background"
        className="rounded-xl"
        src={props.contentUrl}
        width={270}
      />
      <CardFooter >
        <h1>
          {props.id}
        </h1>
      </CardFooter>
    </Card>
  )
}

export default ThumbnailCard
