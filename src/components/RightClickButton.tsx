import React, {RefObject, useEffect, useRef, useState} from "react";
import {Button, cn} from "@heroui/react";

export interface RightClickItem {
  key: string;
  children: React.ReactNode;
  isDisabled?: boolean;
  className?: string;
  variant?: "danger" | "default";
  color?: string;
  onPress?: (e?: React.MouseEvent) => void;
}

export interface RightClickButtonProps {
  btnProps: React.ComponentProps<typeof Button> & {
    children?: React.ReactNode;
    className?: string;
  };
  rightClickItems: RightClickItem[];
}

export default function RightClickButton(props: RightClickButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const buttonRef: RefObject<HTMLButtonElement | null> = useRef(null);

  const openContextMenu = (e: MouseEvent) => {
    if (buttonRef.current && buttonRef.current.contains(e.target as Node)) {
      e.preventDefault();
      e.stopPropagation();

      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({ x: rect.right + 4, y: rect.top });
      setIsOpen(true);
    }
  };

  const closeContextMenu = () => {
    setIsOpen(false);
  };

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
    <div className="h-fit relative w-full overflow-hidden">
      <Button
        {...props.btnProps}
        className={cn("w-full justify-start font-normal text-sm overflow-hidden", props.btnProps.className)}
        ref={buttonRef}
      >
        {typeof props.btnProps.children === "string" ? (
          <span className="truncate">{props.btnProps.children}</span>
        ) : (
          props.btnProps.children
        )}
      </Button>

      {isOpen && (
        <div
          className="fixed z-50 rounded-xl bg-surface border border-separator shadow-lg p-1 min-w-[140px] animate-in fade-in zoom-in-95 duration-100"
          style={{ top: menuPosition.y, left: menuPosition.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-0.5">
            {props.rightClickItems.map((item) => (
              <button
                key={item.key}
                disabled={item.isDisabled}
                className={cn(
                  "flex items-center w-full px-3 py-1.5 text-sm rounded-lg text-left transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
                  item.variant === "danger" || item.color === "danger"
                    ? "text-danger hover:bg-danger/10 hover:text-danger font-medium"
                    : "text-foreground hover:bg-default-100"
                )}
                onClick={(e) => {
                  setIsOpen(false);
                  if (item.onPress) item.onPress(e);
                }}
              >
                {item.children}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
