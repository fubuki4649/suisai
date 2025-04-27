import {ButtonProps, DropdownItemProps} from "@heroui/react";
import {Album} from "../../../models/model.ts";

export type Disclosure = {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
  onOpenChange: () => void,
  isControlled: boolean,
  getButtonProps: (props?: any) => any,
  getDisclosureProps: (props?: any) => any,
};

export type ModalProps = {
  disclosure: Disclosure,
  album: Album,
};

export type RightClickButtonProps = {
  btnProps: ButtonProps,
  rightClickItems: DropdownItemProps[]
};