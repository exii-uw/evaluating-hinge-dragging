import changePerspective from "change-perspective";
import { Matrix, fromTriangles, applyToPoint } from "transformation-matrix";
import { Transform } from "./Transform";
import { Position } from "../tasks";

const stretchFactor = 20;
const stretchOut = (outPos: Position, inPos: Position): Position => {
  const dx = (outPos.x - inPos.x) * stretchFactor;
  const dy = (outPos.y - inPos.y) * stretchFactor;
  return { x: outPos.x + dx, y: outPos.y + dy };
};

const isInHull = (hull: Position[], pos: Position): boolean => {
  for (let i = 0; i < hull.length; i++) {
    const a = hull[i];
    const b = hull[(i + 1) % hull.length];
    const c = pos;
    // If point is to the right of the line from a to b, it's outside the hull
    if ((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) < -0.000001)
      return false;
  }
  // Otherwise, we're in!
  return true;
};

// Assume there are 2n + 1 points, where the first n are a convex hull, organized
// clockwise; the second n are a convex hull contained within the first n, and the
// last is the center of the hull.
// Note that it's clockwise in our visual sense, BUT technically, mathematically, it's
// counter-clockwise (which makes convex hull algorithms work) because js has inverted
// y axis.
const affine25 = (srcPoints: Position[], destPoints: Position[]): Transform => {
  const lastIdx = srcPoints.length - 1;
  const oSrc = srcPoints[lastIdx];
  const oDest = destPoints[lastIdx];

  // Separate outer and inner
  const n = lastIdx / 2;
  const outSrc = srcPoints.slice(0, n);
  const outDest = destPoints.slice(0, n);
  const inSrc = srcPoints.slice(n, 2 * n);
  const inDest = destPoints.slice(n, 2 * n);

  // Make all the transformation matrices
  // The polylines are convex hulls in counter-clockwise order
  let hulls: Position[][] = [];
  let transforms: Transform[] = [];

  // Start with the inner ones
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    hulls.push([inSrc[i], inSrc[j], oSrc]);
    const src = [inSrc[i], inSrc[j], oSrc];
    const dest = [inDest[i], inDest[j], oDest];
    const mat: Matrix = fromTriangles(src, dest);
    transforms.push((x, y) => applyToPoint(mat, [x, y]));
  }

  // Then add outer ones, but expand their reach to be 3 times further
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    // Counter clockwise
    hulls.push([
      inSrc[i],
      stretchOut(outSrc[i], inSrc[i]),
      stretchOut(outSrc[j], inSrc[j]),
      inSrc[j],
    ]);

    const src = [inSrc[i], outSrc[i], outSrc[j], inSrc[j]].flatMap((p) => [
      p.x,
      p.y,
    ]);
    const dest = [inDest[i], outDest[i], outDest[j], inDest[j]].flatMap((p) => [
      p.x,
      p.y,
    ]);
    // @ts-ignore
    transforms.push(changePerspective(src, dest));
  }

  return (x: number, y: number) => {
    for (let i = 0; i < transforms.length; i++) {
      if (isInHull(hulls[i], { x, y })) {
        return transforms[i](x, y);
      }
    }
    throw new Error("Point to transform was way out of bounds");
  };
};

export default affine25;
