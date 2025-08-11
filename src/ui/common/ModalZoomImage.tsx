import {Image, ImageProps, Modal, ModalContent, useDisclosure} from "@heroui/react";
import React from "react";


export default function ModalZoomImage(props: ImageProps) {

  const {isOpen, onOpen, onClose} = useDisclosure();

  return (
    <>
      <Image
        {...props}
        onDoubleClick={() => onOpen()}
      />

      <Modal isOpen={isOpen} backdrop="blur" onClose={onClose} classNames={{
        wrapper: "w-auto h-auto max-w-full max-h-full",
        base: "w-auto h-auto max-w-full max-h-full bg-transparent shadow-none !m-0",
        closeButton: "bg-background m-4"
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