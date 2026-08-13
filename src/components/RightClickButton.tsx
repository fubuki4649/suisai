import {RefObject, useEffect, useRef, useState} from "react";
import {Button, ButtonProps, cn, Dropdown, DropdownItem, DropdownItemProps, DropdownMenu, DropdownTrigger} from "@heroui/react";
import {useDarkMode} from "../context/GalleryContext.tsx";

export interface RightClickButtonProps {
  btnProps: ButtonProps;
  rightClickItems: DropdownItemProps[];
}

export default function RightClickButton(props: RightClickButtonProps) {
  const [darkMode] = useDarkMode();

  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const buttonRef: RefObject<HTMLButtonElement | null> = useRef(null);

  // Handle right-click
  const openContextMenu = (e: MouseEvent | any) => {
    if (buttonRef.current && buttonRef.current.contains(e.target as Node)) {
      e.preventDefault();
      e.stopPropagation();

      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({ x: rect.right + 4, y: (rect.top + rect.bottom) / 2 });
      setIsOpen(true);
    }
  };

  const closeContextMenu = (e: MouseEvent | any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
  };

  // Set up global event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("contextmenu", closeContextMenu);
      document.addEventListener("click", closeContextMenu);
    } else {
      document.addEventListener("contextmenu", openContextMenu);
    }

    return () => {
      document.removeEventListener("contextmenu", openContextMenu);
      document.removeEventListener("contextmenu", closeContextMenu);
      document.removeEventListener("click", closeContextMenu);
    };
  }, [isOpen]);

  return (
    <div className="h-fit">
      <Button {...props.btnProps} fullWidth ref={buttonRef}>
        <span>{props.btnProps.children}</span>
      </Button>

      {isOpen && (
        <div className="!m-0">
          <Dropdown isOpen className={cn(darkMode && "dark text-foreground")} placement="right" backdrop="blur">
            <DropdownTrigger>
              {/* Invisible trigger */}
              <div className="absolute" style={{ top: menuPosition.y, left: menuPosition.x }} />
            </DropdownTrigger>
            <DropdownMenu aria-label="Context Menu" variant="flat">
              <>
                {props.rightClickItems.map((item) => (
                  <DropdownItem
                    {...item}
                    key={item.key}
                    onPress={(e) => {
                      setIsOpen(false);
                      if (item.onPress) item.onPress(e);
                    }}
                  >
                    {item.children}
                  </DropdownItem>
                ))}
              </>
            </DropdownMenu>
          </Dropdown>
        </div>
      )}
    </div>
  );
}
