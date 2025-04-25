import {Card, cn, Image} from "@heroui/react";
import React from "react";
import {ThumbnailCardProps} from "./ViewModel.ts";


function ThumbnailCard(props: ThumbnailCardProps) {

  const handleClick = () => {
    props.onClick(props.id);
  };

  return (
    <Card
      isPressable
      onPress={handleClick}
      shadow={cn(props.isSelected ? "lg" : "sm") as ("lg" | "sm")}
      className={cn(props.isSelected && "border-2 border-secondary", "h-fit w-fit")}
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
