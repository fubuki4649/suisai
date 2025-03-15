import type {NavbarProps} from "@heroui/react";

export type HeaderProps = {
  darkMode: boolean;
  darkModeHandler: (isSelected: boolean) => void;
  navbarProps?: NavbarProps
}