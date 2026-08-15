import {Modal, useOverlayState} from "@heroui/react";
import React, {ImgHTMLAttributes} from "react";

export interface ModalZoomImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  removeWrapper?: boolean;
}

// An Image component that expands into a fullscreen modal when double-clicked
export default function ModalZoomImage(props: ModalZoomImageProps) {
  const state = useOverlayState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {removeWrapper, ...imgProps} = props;

  return (
    <>
      <img
        {...imgProps}
        onDoubleClick={() => state.open()} alt="Image"
      />

      <Modal state={state}>
        <Modal.Backdrop variant="blur">
          <Modal.Container size="full">
            <Modal.Dialog className="bg-transparent shadow-none p-0 border-none flex items-center justify-center h-full w-full max-w-none">
              <Modal.CloseTrigger className="absolute top-4 right-4 z-50 bg-surface/80 hover:bg-surface rounded-full p-2 text-foreground cursor-pointer" />
              <img
                className="max-h-[90vh] max-w-[90vw] object-contain cursor-pointer select-none"
                src={props.src}
                alt={props.alt}
                onClick={() => state.close()}
              />
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}