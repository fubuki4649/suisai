import React, {useState} from "react";
import {createPortal} from "react-dom";
import {Button, cn, Popover} from "@heroui/react";

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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <div className="h-fit w-full">
      {isOpen && typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-40 bg-backdrop backdrop-blur-sm transition-opacity duration-200"
            onClick={() => setIsOpen(false)}
          />,
          document.body
        )}

      <Popover
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsOpen(false);
          }
        }}
      >
        <Button
          {...props.btnProps}
          className={cn("w-full justify-start font-normal text-sm overflow-hidden", props.btnProps.className)}
          onContextMenu={handleContextMenu}
        >
          {typeof props.btnProps.children === "string" ? (
            <span className="truncate">{props.btnProps.children}</span>
          ) : (
            props.btnProps.children
          )}
        </Button>

        {isOpen && (
          <Popover.Content placement="right" offset={16} className="z-50">
            <Popover.Arrow className="fill-surface" />
            <Popover.Dialog className="p-1.5 min-w-32 bg-surface border border-separator rounded-2xl shadow-xl">
              <div className="flex flex-col gap-0.5 w-full">
                {props.rightClickItems.map((item) => (
                  <button
                    key={item.key}
                    disabled={item.isDisabled}
                    className={cn(
                      "group flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-xl text-left font-medium transition-all duration-150 cursor-pointer select-none",
                      "active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100",
                      item.variant === "danger" || item.color === "danger"
                        ? "text-danger hover:bg-danger/15 hover:text-danger active:bg-danger/25"
                        : "text-foreground hover:bg-accent/15 hover:text-accent active:bg-accent/25",
                      item.className
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
            </Popover.Dialog>
          </Popover.Content>
        )}
      </Popover>
    </div>
  );
}
