import React, {useState} from "react";
import {
  cn,
  Divider,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarProps,
  Spacer,
  Switch,
} from "@heroui/react";
import {FilmIcon, MoonIcon, Squares2X2Icon, SunIcon} from "@heroicons/react/16/solid";
import {useDarkMode} from "../context/GalleryContext.tsx";
import {useLocation, useNavigate} from "react-router-dom";

export interface HeaderProps {
  navbarProps?: NavbarProps;
}

export default function Header(props: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();

  const location = useLocation();
  const navigate = useNavigate();

  const navbarProps: NavbarProps = {
    ...props.navbarProps,
    height: "50px",
    maxWidth: "full",
    isMenuOpen: isMenuOpen,
    onMenuOpenChange: setIsMenuOpen,
  };

  const isLightbox = location.pathname === "/gallery/lightbox";

  return (
    <Navbar {...navbarProps}>
      {/* Left Content */}
      <NavbarBrand className="cursor-pointer select-none" onClick={() => navigate("/gallery")}>
        <img src="/suisai.svg" className="h-10 w-10 rounded-lg shadow-sm" alt="Suisai Logo" />
        <span className="ml-1 text-2xl font-semibold tracking-tight text-foreground font-sans">
          suisai
        </span>
      </NavbarBrand>

      <NavbarContent className="flex-grow" />

      {/* Right Content */}
      <NavbarContent className="hidden md:flex" justify="end">
        <NavbarItem className="ml-2 !flex gap-2">
          <Switch
            isSelected={isLightbox}
            onValueChange={(isSelected) => (isSelected ? navigate("/gallery/lightbox") : navigate("/gallery"))}
            color="primary"
            size="lg"
            classNames={{startContent: "text-white"}}
            startContent={<FilmIcon/>}
            endContent={<Squares2X2Icon/>}
          >
            <p className="text-medium text-default-500 w-14">{isLightbox ? "Lightbox" : "Gallery"}</p>
          </Switch>

          <Spacer />

          <Switch
            isSelected={!darkMode}
            onValueChange={(state) => setDarkMode(!state)}
            color="warning"
            size="lg"
            classNames={{startContent: "text-white"}}
            startContent={<SunIcon/>}
            endContent={<MoonIcon/>}
          >
            <p className="text-medium text-default-500 w-8">{darkMode ? "Dark" : "Light"}</p>
          </Switch>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile View */}
      <NavbarMenuToggle className="text-default-400 md:hidden" />
      <NavbarMenu className={cn(darkMode && "dark", "text-background bg-default-200/50 dark:bg-default-50/50 pb-6 pt-6 shadow-medium backdrop-blur-md backdrop-saturate-150")}>
        <Divider className="opacity-50 my-2" />
        <NavbarItem>
          <Switch
            isSelected={!darkMode}
            onValueChange={(state) => setDarkMode(!state)}
            color="warning"
            size="lg"
            classNames={{startContent: "text-white"}}
            startContent={<SunIcon/>}
            endContent={<MoonIcon/>}
          >
            <p className="text-default-500">{darkMode ? "Dark Mode" : "Light Mode"}</p>
          </Switch>
        </NavbarItem>
      </NavbarMenu>
    </Navbar>
  );
}
