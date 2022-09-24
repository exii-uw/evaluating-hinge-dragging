import { NormalizedEvent } from "../tasks/DragEvents";
import { BoundingBox } from "../tasks/tasks";

interface Drag {
  blockID: string;
  idx: number;
  touchIdx: number; // or -1 if it failed
  success: boolean;
  events: NormalizedEvent[];
}

class Logger {
  public static calibrate(box: BoundingBox) {
    console.log({
      ...box,
      type: "calibrate",
    });
  }

  public static logDrag(drag: Drag) {
    console.log({
      ...drag,
      type: "drag",
    });
  }
}

export default Logger;
