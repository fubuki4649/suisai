"use client";

import React, {useState} from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Link, Button, Divider, NavbarProps, Switch, Spacer, cn,} from "@heroui/react";
import {HeaderProps} from "./ViewModel.ts";
import {MoonIcon, SunIcon} from "@heroicons/react/16/solid";


export default function Header(props: HeaderProps) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navbarProps: NavbarProps = {
    ...props.navbarProps,
    height: "60px",
    maxWidth: "2xl",
    isMenuOpen: isMenuOpen,
    onMenuOpenChange: setIsMenuOpen,
  };

  return (
    <Navbar {...navbarProps}>

      {/* Left Content */}
      <NavbarBrand>
        <div className="rounded-full bg-foreground text-background">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </div>
        <span className="ml-2 text-large font-medium">suisai</span>
      </NavbarBrand>

      <NavbarContent className="flex-grow" />

      {/*Right Content*/}
      <NavbarContent className="hidden md:flex" justify="end">
        <NavbarItem className="ml-2 !flex gap-2">

          <Switch defaultSelected={!props.darkMode} onValueChange={(state) => props.darkModeHandler(!state)}
                  color="warning" size="lg" classNames={{startContent: "text-white"}}
                  startContent={<SunIcon/>} endContent={<MoonIcon/>}>
            <p className="text-medium text-default">{props.darkMode ? "Dark Mode" : "Light Mode"}</p>
          </Switch>

          <Spacer />

          <Button className="text-default-500" radius="full" variant="light">
            Sign Out
          </Button>

        </NavbarItem>
      </NavbarContent>


      {/*Mobile View*/}
      <NavbarMenuToggle className="text-default-400 md:hidden" />
      <NavbarMenu className={cn(props.darkMode && "dark", "text-background bg-default-200/50 dark:bg-default-50/50 pb-6 pt-6 shadow-medium backdrop-blur-md backdrop-saturate-150")}>

        <NavbarMenuItem>
          <Button fullWidth as={Link} href="/#" variant="faded">
            Log Out
          </Button>
        </NavbarMenuItem>

        <Divider className="opacity-50 my-2" />

        <NavbarItem>
          <Switch defaultSelected={!props.darkMode} onValueChange={(state) => props.darkModeHandler(!state)}
                  color="warning" size="lg" classNames={{startContent: "text-white"}}
                  startContent={<SunIcon/>} endContent={<MoonIcon/>}>
            <p className="text-default-500">{props.darkMode ? "Dark Mode" : "Light Mode"}</p>
          </Switch>
        </NavbarItem>

      </NavbarMenu>
    </Navbar>
  );
}
