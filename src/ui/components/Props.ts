import React from "react";
import {ButtonProps, DropdownItemProps} from "@heroui/react";


export type ImageCardProps = {
  id: number,
  alt: string,
  previewUrl: string,
  isSelected: boolean,
  allowZoom: boolean,
}

export type ICCProps = React.HTMLAttributes<HTMLUListElement> & {
  cardWidth?: number,
  allowCardZoom?: boolean,
};

export type RightClickButtonProps = {
  btnProps: ButtonProps,
  rightClickItems: DropdownItemProps[]
};