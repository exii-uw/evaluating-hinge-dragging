import { Position } from "../tasks";
import { Matrix, fromTriangles, applyToPoint } from "transformation-matrix";
import { Transform } from "./Transform";

// Assume all points are a convex hull, organized clockwise, except the last point, which is in the center of the hull
const affine13 = (srcPoints: Position[], destPoints: Position[]): Transform => {
  const lastIdx = srcPoints.length - 1;
  const oSrc = srcPoints[lastIdx];
  const oDest = destPoints[lastIdx];

  const matrices: Matrix[] = [];
  const angles: number[] = [];

  for (let i = 0; i < srcPoints.length - 1; i++) {
    const j = (i + 1) % lastIdx;
    const src = [srcPoints[i], srcPoints[j], oSrc];
    const dest = [destPoints[i], destPoints[j], oDest];
    matrices.push(fromTriangles(src, dest));

    // Recall: y is inverted in JS compared to mathmatical unit circle
    const angle = Math.atan2(-srcPoints[i].y + oSrc.y, srcPoints[i].x - oSrc.x);
    angles.push(angle >= 0 ? angle : angle + Math.PI * 2);
  }

  const transform: Transform = (x, y) => {
    // Edge case: if we're at the origin
    if (x === oSrc.x && y === oSrc.y) {
      return [oDest.x, oDest.y];
    }
    // First, decide which transform it's in
    // Get the angle of this point from the origin
    let angle = Math.atan2(-y + oSrc.y, x - oSrc.x);
    if (angle < 0) angle += Math.PI * 2;
    // Determine which transform this maps to
    for (let i = 0; i < angles.length - 1; i++) {
      // Edge case when we are at the end of the unit circle
      if (angles[i] < angles[i + 1]) {
        if (angle <= angles[i] || angle > angles[i + 1]) {
          return applyToPoint(matrices[i], [x, y]);
        }
      } else {
        if (angle <= angles[i] && angle > angles[i + 1]) {
          return applyToPoint(matrices[i], [x, y]);
        }
      }
    }

    // Otherwise, it's the last transform
    return applyToPoint(matrices[matrices.length - 1], [x, y]);
  };

  return transform;
};

export default affine13;
