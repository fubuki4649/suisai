import {Card, cn, Image, PressEvent} from "@heroui/react";
import React from "react";
import {ThumbnailCardProps} from "./ViewModel.ts";


function ThumbnailCard(props: ThumbnailCardProps) {

  return (
    <Card
      isPressable
      onPress={(e: PressEvent) => props.onClick(props.id, e)}
      shadow={cn(props.isSelected ? "lg" : "sm") as ("lg" | "sm")}
      className={cn(props.isSelected && "border-2 border-secondary", props.isSelected && "m-[-2px]", "h-fit w-fit")}
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
