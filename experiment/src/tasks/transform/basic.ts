import changePerspective from "change-perspective";
import { Position } from "../tasks";
import { Transform } from "./Transform";

// Four point transformation
const basic = (srcPoints: Position[], destPoints: Position[]): Transform => {
  return changePerspective(
    // @ts-ignore
    srcPoints.flatMap((p) => [p.x, p.y]),
    destPoints.flatMap((p) => [p.x, p.y])
  );
};

export default basic;
