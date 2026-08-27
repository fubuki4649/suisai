import {Button, Modal, Separator, Tooltip, useOverlayState} from "@heroui/react";
import {Icon} from "@iconify/react";
import React, {ImgHTMLAttributes, useCallback, useEffect, useRef, useState} from "react";

export interface ModalZoomImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  removeWrapper?: boolean;
}

interface Point {
  x: number;
  y: number;
}

const MIN_SCALE = 1;
const MAX_SCALE = 8;
const DOUBLE_CLICK_SCALE = 2.5;

function ZoomViewerModal({
  isOpen,
  onClose,
  src,
  alt,
}: {
  isOpen: boolean;
  onClose: () => void;
  src?: string;
  alt?: string;
}) {
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<Point>({x: 0, y: 0});
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const activePointersRef = useRef<Map<number, Point>>(new Map());
  const dragStartRef = useRef<{startX: number; startY: number; initialPosX: number; initialPosY: number}>({
    startX: 0,
    startY: 0,
    initialPosX: 0,
    initialPosY: 0,
  });
  const pinchStartRef = useRef<{initialDistance: number; initialScale: number; centerPoint: Point} | null>(null);


  // Clamp translation based on scaled dimensions
  const clampPosition = useCallback((targetX: number, targetY: number, targetScale: number): Point => {
    if (targetScale <= 1 || !containerRef.current || !imageRef.current) {
      return {x: 0, y: 0};
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();

    const baseWidth = imageRect.width / (scale || 1);
    const baseHeight = imageRect.height / (scale || 1);

    const scaledWidth = baseWidth * targetScale;
    const scaledHeight = baseHeight * targetScale;

    const maxX = Math.max(0, (scaledWidth - containerRect.width) / 2) + 60;
    const maxY = Math.max(0, (scaledHeight - containerRect.height) / 2) + 60;

    return {
      x: Math.min(Math.max(targetX, -maxX), maxX),
      y: Math.min(Math.max(targetY, -maxY), maxY),
    };
  }, [scale]);

  const zoomTo = useCallback((newScale: number, focalPoint?: Point) => {
    const nextScale = Math.min(Math.max(MIN_SCALE, newScale), MAX_SCALE);
    if (nextScale === 1) {
      setScale(1);
      setPosition({x: 0, y: 0});
      return;
    }

    if (focalPoint && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const focalX = focalPoint.x - (rect.left + rect.width / 2);
      const focalY = focalPoint.y - (rect.top + rect.height / 2);

      const ratio = nextScale / scale;
      const nextX = focalX - (focalX - position.x) * ratio;
      const nextY = focalY - (focalY - position.y) * ratio;

      setScale(nextScale);
      setPosition(clampPosition(nextX, nextY, nextScale));
    } else {
      setScale(nextScale);
      setPosition((prev) => clampPosition(prev.x, prev.y, nextScale));
    }
  }, [clampPosition, position.x, position.y, scale]);

  const zoomIn = useCallback(() => {
    zoomTo(scale * 1.3);
  }, [scale, zoomTo]);

  const zoomOut = useCallback(() => {
    zoomTo(scale / 1.3);
  }, [scale, zoomTo]);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({x: 0, y: 0});
  }, []);

  // Keyboard navigation & shortcuts
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        zoomIn();
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        zoomOut();
      } else if (e.key === "0") {
        e.preventDefault();
        resetZoom();
      } else if (e.key === "ArrowLeft" && scale > 1) {
        e.preventDefault();
        setPosition((prev) => clampPosition(prev.x + 50, prev.y, scale));
      } else if (e.key === "ArrowRight" && scale > 1) {
        e.preventDefault();
        setPosition((prev) => clampPosition(prev.x - 50, prev.y, scale));
      } else if (e.key === "ArrowUp" && scale > 1) {
        e.preventDefault();
        setPosition((prev) => clampPosition(prev.x, prev.y + 50, scale));
      } else if (e.key === "ArrowDown" && scale > 1) {
        e.preventDefault();
        setPosition((prev) => clampPosition(prev.x, prev.y - 50, scale));
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [clampPosition, isOpen, resetZoom, scale, zoomIn, zoomOut]);

  // Wheel zoom centered on mouse cursor
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const zoomFactor = e.deltaY < 0 ? 1.18 : 1 / 1.18;
    zoomTo(scale * zoomFactor, {x: e.clientX, y: e.clientY});
  };

  // Double click toggles between fit (1x) and 2.5x
  const onDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (scale > 1.05) {
      resetZoom();
    } else {
      zoomTo(DOUBLE_CLICK_SCALE, {x: e.clientX, y: e.clientY});
    }
  };

  // Pointer & touch handling for panning and pinch zoom
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    activePointersRef.current.set(e.pointerId, {x: e.clientX, y: e.clientY});

    if (activePointersRef.current.size === 1) {
      if (scale > 1) {
        setIsDragging(true);
        dragStartRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          initialPosX: position.x,
          initialPosY: position.y,
        };
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // ignore if capture fails
        }
      }
    } else if (activePointersRef.current.size === 2) {
      const points = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
      pinchStartRef.current = {
        initialDistance: dist,
        initialScale: scale,
        centerPoint: {
          x: (points[0].x + points[1].x) / 2,
          y: (points[0].y + points[1].y) / 2,
        },
      };
      setIsDragging(false);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activePointersRef.current.has(e.pointerId)) return;
    activePointersRef.current.set(e.pointerId, {x: e.clientX, y: e.clientY});

    // Pinch zoom handling
    if (activePointersRef.current.size === 2 && pinchStartRef.current) {
      const points = Array.from(activePointersRef.current.values());
      const currentDist = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
      const pinchRatio = currentDist / (pinchStartRef.current.initialDistance || 1);
      const targetScale = pinchStartRef.current.initialScale * pinchRatio;
      zoomTo(targetScale, pinchStartRef.current.centerPoint);
      return;
    }

    // Single touch/mouse drag panning
    if (activePointersRef.current.size === 1 && isDragging && scale > 1) {
      const deltaX = e.clientX - dragStartRef.current.startX;
      const deltaY = e.clientY - dragStartRef.current.startY;
      const newX = dragStartRef.current.initialPosX + deltaX;
      const newY = dragStartRef.current.initialPosY + deltaY;
      setPosition(clampPosition(newX, newY, scale));
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointersRef.current.delete(e.pointerId);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }

    if (activePointersRef.current.size === 0) {
      setIsDragging(false);
      pinchStartRef.current = null;
    } else if (activePointersRef.current.size === 1) {
      pinchStartRef.current = null;
      const remainingPoint = Array.from(activePointersRef.current.values())[0];
      dragStartRef.current = {
        startX: remainingPoint.x,
        startY: remainingPoint.y,
        initialPosX: position.x,
        initialPosY: position.y,
      };
      if (scale > 1) {
        setIsDragging(true);
      }
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
      {/* Top right close button */}
      <button
        type="button"
        className="absolute top-4 right-4 z-50 bg-surface/80 hover:bg-surface text-foreground border border-separator rounded-full p-2.5 shadow-lg backdrop-blur-md cursor-pointer transition-colors"
        onClick={onClose}
        aria-label="Close modal"
      >
        <Icon icon="gravity-ui:xmark" className="w-5 h-5" />
      </button>

      {/* Floating Bottom Toolbar */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface/80 dark:bg-surface/85 backdrop-blur-md border border-separator shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Tooltip delay={200}>
          <Tooltip.Trigger>
            <Button
              isIconOnly
              size="sm"
              variant="tertiary"
              aria-label="Zoom Out"
              onPress={zoomOut}
              isDisabled={scale <= MIN_SCALE}
            >
              <Icon icon="gravity-ui:minus" className="w-4 h-4" />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>Zoom Out (-)</p>
          </Tooltip.Content>
        </Tooltip>

        <Tooltip delay={200}>
          <Tooltip.Trigger>
            <Button
              size="sm"
              variant="ghost"
              aria-label="Reset Zoom Level"
              onPress={resetZoom}
              className="text-xs font-mono font-medium px-2 h-8 min-w-14"
            >
              {Math.round(scale * 100)}%
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>Reset to 100% (0)</p>
          </Tooltip.Content>
        </Tooltip>

        <Tooltip delay={200}>
          <Tooltip.Trigger>
            <Button
              isIconOnly
              size="sm"
              variant="tertiary"
              aria-label="Zoom In"
              onPress={zoomIn}
              isDisabled={scale >= MAX_SCALE}
            >
              <Icon icon="gravity-ui:plus" className="w-4 h-4" />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>Zoom In (+)</p>
          </Tooltip.Content>
        </Tooltip>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <Tooltip delay={200}>
          <Tooltip.Trigger>
            <Button
              isIconOnly
              size="sm"
              variant="tertiary"
              aria-label="Fit to Screen"
              onPress={resetZoom}
              isDisabled={scale === 1 && position.x === 0 && position.y === 0}
            >
              <Icon icon="gravity-ui:arrow-rotate-left" className="w-4 h-4" />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>Fit to Screen (0)</p>
          </Tooltip.Content>
        </Tooltip>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <Tooltip delay={200}>
          <Tooltip.Trigger>
            <Button
              isIconOnly
              size="sm"
              variant="tertiary"
              aria-label="Close Viewer"
              onPress={onClose}
            >
              <Icon icon="gravity-ui:xmark" className="w-4 h-4" />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>Close (Esc)</p>
          </Tooltip.Content>
        </Tooltip>
      </div>

      {/* Interactive viewport area */}
      <div
        ref={containerRef}
        className={`w-full h-full flex items-center justify-center touch-none overflow-hidden ${
          scale > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
        }`}
        onWheel={onWheel}
        onDoubleClick={onDoubleClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img
          ref={imageRef}
          className="max-h-[90vh] max-w-[90vw] object-contain select-none pointer-events-none will-change-transform"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0px) scale(${scale})`,
            transition: isDragging ? "none" : "transform 0.15s cubic-bezier(0.2, 0, 0, 1)",
          }}
          src={src}
          alt={alt}
          draggable={false}
        />
      </div>
    </div>
  );
}

// An Image component that expands into an interactive zoomable modal when double-clicked
export default function ModalZoomImage(props: ModalZoomImageProps) {
  const state = useOverlayState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {removeWrapper, ...imgProps} = props;

  return (
    <>
      <img
        loading="lazy"
        decoding="async"
        alt="Image"
        {...imgProps}
        onDoubleClick={() => state.open()}
      />

      {state.isOpen && (
        <Modal state={state}>
          <Modal.Backdrop variant="blur">
            <Modal.Container size="full">
              <Modal.Dialog className="bg-transparent shadow-none p-0 border-none flex items-center justify-center h-full w-full max-w-none">
                <ZoomViewerModal
                  isOpen={state.isOpen}
                  onClose={() => state.close()}
                  src={props.src}
                  alt={props.alt}
                />
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}
    </>
  );
}