import {cn, Image, ImageProps, Modal, ModalContent, useDisclosure} from "@heroui/react";
import React from "react";
import {useDarkMode} from "./GlobalContext.tsx";


// An Image component that expands into a fullscreen modal when double-clicked
export default function ModalZoomImage(props: ImageProps) {

  const [darkMode] = useDarkMode();
  const {isOpen, onOpen, onClose} = useDisclosure();

  return (
    <>
      <Image
        {...props}
        onDoubleClick={() => onOpen()}
      />

      <Modal isOpen={isOpen} backdrop="blur" onClose={onClose} className={cn(darkMode && "dark text-foreground")} classNames={{
        wrapper: "w-auto h-auto max-w-full max-h-full",
        base: "w-auto h-auto max-w-full max-h-full bg-transparent shadow-none !m-0",
        closeButton: "bg-content3 m-4"
      }} onClick={() => onClose()}>
        <ModalContent>
          <img
            className="h-full w-full object-contain"
            src={props.src}
            alt={props.alt}
          />
        </ModalContent>
      </Modal>
    </>
  )
}