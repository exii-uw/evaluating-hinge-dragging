import { Transformer } from "./CalibrationController";
import { BoundingBox, Position } from "./tasks";

const posInBox = (pos: Position, box: BoundingBox): Position => {
  return {
    x: (pos.x - box.left) / box.width,
    y: (pos.y - box.top) / box.height,
  };
};

export interface TouchPos {
  rawPos: Position; // position detected
  actualPos: Position; // after calibration offset
  normPos: Position; // after normalizing
  radius?: Position; // (radiusX, radiusY)
  rotation?: number; // in degrees
}

export interface NormalizedEvent {
  timeStamp: number; // from the event
  positions: Record<string, TouchPos>; // Position of each touch, mapped by identifier
}

export const getNormalizedTouchEvent = (
  touch: TouchEvent,
  transformer: Transformer
): NormalizedEvent => {
  return {
    timeStamp: touch.timeStamp,
    positions: Object.assign(
      {},
      ...Array.from(touch.touches).map((t) => {
        const transformed = transformer.transform(t.clientX, t.clientY);
        return {
          [t.identifier]: {
            rawPos: { x: t.clientX, y: t.clientY },
            actualPos: { x: transformed[0], y: transformed[1] },
            normPos: posInBox(
              { x: transformed[0], y: transformed[1] },
              transformer.box
            ),
            radius: { x: t.radiusX, y: t.radiusY },
            rotation: t.rotationAngle,
          },
        };
      })
    ),
  };
};

export const getNormalizedMouseEvent = (
  mouse: MouseEvent,
  transformer: Transformer
): NormalizedEvent => {
  const transformed = transformer.transform(mouse.clientX, mouse.clientY);
  return {
    timeStamp: mouse.timeStamp,
    positions: {
      1: {
        rawPos: { x: mouse.clientX, y: mouse.clientY },
        actualPos: { x: transformed[0], y: transformed[1] },
        normPos: posInBox(
          { x: transformed[0], y: transformed[1] },
          transformer.box
        ),
      },
    },
  };
};

export enum DragStatus {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  DRAGGING = "DRAGGING",
  IDLE = "IDLE",
}
