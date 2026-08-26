import React from "react";
import { createPortal } from "react-dom";

interface BackdropPortalProps {
  onDismiss: () => void;
}

export default function BackdropPortal({ onDismiss }: BackdropPortalProps) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      className="fixed inset-0 z-40 bg-backdrop backdrop-blur-sm transition-opacity duration-200"
      onClick={onDismiss}
    />,
    document.body
  );
}
