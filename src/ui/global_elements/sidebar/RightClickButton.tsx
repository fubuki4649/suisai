'use client';

import {useRef, useState, useEffect, RefObject} from 'react';
import {Button, cn, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@heroui/react";
import {useDarkMode} from "../../../models/GlobalContext.tsx";

export default function RightClickButton() {

  const [darkMode] = useDarkMode();

  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const buttonRef: RefObject<HTMLButtonElement | null> = useRef(null);

  // Handle right-click
  const openContextMenu = (e: any) => {
    if (buttonRef.current && buttonRef.current.contains(e.target)) {
      e.preventDefault();
      e.stopPropagation();

      const rect = buttonRef.current.getBoundingClientRect();
      console.log(rect);
      setMenuPosition({ x: rect.right, y: (rect.top + rect.bottom) / 2 });
      setIsOpen(true);
    }
  };

  const closeContextMenu = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
  }

  // Set up global event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('contextmenu', closeContextMenu);
      document.addEventListener('click', closeContextMenu);
    }
    else document.addEventListener('contextmenu', openContextMenu);

    return () => {
      document.removeEventListener('contextmenu', openContextMenu);
      document.removeEventListener('contextmenu', closeContextMenu);
      document.removeEventListener('click', closeContextMenu);
    };
  }, [isOpen]);

  return (
    <>
      <Button fullWidth ref={buttonRef}>Right Click Me</Button>

      {isOpen && (
        <div>
          <Dropdown isOpen className={cn(darkMode && "dark text-foreground")} placement="right">
            <DropdownTrigger>
              {/* Invisible trigger */}
              <div className="absolute" style={{ top: menuPosition.y, left: menuPosition.x }} />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Context Menu"
              onAction={(key) => {
                console.log("Selected action:", key);
                setIsOpen(false);
              }}
              variant="faded"
            >
              <DropdownItem key="edit">Edit</DropdownItem>
              <DropdownItem key="delete">Delete</DropdownItem>
              <DropdownItem key="copy">Copy</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      )}
    </>
  );
}
