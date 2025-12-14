"use client";

import React, {useState} from "react";
import {
  Button,
  cn,
  Divider,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  NavbarProps,
  Spacer,
  Switch,
} from "@heroui/react";
import {HeaderProps} from "./props.ts";
import {FilmIcon, MoonIcon, Squares2X2Icon, SunIcon} from "@heroicons/react/16/solid";
import {useDarkMode} from "../GlobalContext.tsx";
import {useLocation, useNavigate} from "react-router-dom";


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

  return (
    <Navbar {...navbarProps} >

      {/* Left Content */}
      <NavbarBrand>
        <div className="rounded-full bg-foreground text-background">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </div>
        <span className="ml-2 text-2xl font-medium">suisai</span>
      </NavbarBrand>

      <NavbarContent className="flex-grow" />

      {/*Right Content*/}
      <NavbarContent className="hidden md:flex" justify="end">
        <NavbarItem className="ml-2 !flex gap-2">

          <Switch defaultSelected={location.pathname == "/gallery/lightbox"} onValueChange={(isSelected) => isSelected ? navigate("/gallery/lightbox") : navigate("/gallery")}
                  color="primary" size="lg" classNames={{startContent: "text-white"}}
                  startContent={<FilmIcon/>} endContent={<Squares2X2Icon/>}>
            <p className="text-medium text-default-500 w-14">{location.pathname == "/gallery/lightbox" ? "Lightbox" : "Gallery"}</p>
          </Switch>

          <Spacer />

          <Switch defaultSelected={!darkMode} onValueChange={(state) => setDarkMode(!state)}
                  color="warning" size="lg" classNames={{startContent: "text-white"}}
                  startContent={<SunIcon/>} endContent={<MoonIcon/>}>
            <p className="text-medium text-default-500 w-8">{darkMode ? "Dark" : "Light"}</p>
          </Switch>

          <Spacer />

          <Button className="text-default-500 text-medium" radius="full" variant="light">
            Sign Out
          </Button>

        </NavbarItem>
      </NavbarContent>


      {/*Mobile View*/}
      <NavbarMenuToggle className="text-default-400 md:hidden" />
      <NavbarMenu className={cn(darkMode && "dark", "text-background bg-default-200/50 dark:bg-default-50/50 pb-6 pt-6 shadow-medium backdrop-blur-md backdrop-saturate-150")}>

        <NavbarMenuItem>
          <Button fullWidth as={Link} href="/#" variant="faded">
            Log Out
          </Button>
        </NavbarMenuItem>

        <Divider className="opacity-50 my-2" />

        <NavbarItem>
          <Switch defaultSelected={!darkMode} onValueChange={(state) => setDarkMode(!state)}
                  color="warning" size="lg" classNames={{startContent: "text-white"}}
                  startContent={<SunIcon/>} endContent={<MoonIcon/>}>
            <p className="text-default-500">{darkMode ? "Dark Mode" : "Light Mode"}</p>
          </Switch>
        </NavbarItem>

      </NavbarMenu>
    </Navbar>
  );
}
