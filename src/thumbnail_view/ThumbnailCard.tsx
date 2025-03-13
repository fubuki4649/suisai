import {Card, CardFooter, Image} from "@heroui/react";
import React from "react";
import {ThumbnailCardProps} from "./ViewModel.ts";
import clsx from "clsx";


function ThumbnailCard(props: ThumbnailCardProps) {

  const handleClick = () => {
    props.onClick(props.id);
  };

  return (
    <Card
      isPressable
      onPress={handleClick}
      shadow={clsx(props.isSelected ? "lg" : "sm") as ("lg" | "sm")}
      className={clsx(props.isSelected && "border-2 border-secondary", "h-fit w-fit")}
    >
      <Image
        alt="Card background"
        className="rounded-xl"
        src={props.previewUrl}
        width={270}
      />
    </Card>
  )
}

export default ThumbnailCard
