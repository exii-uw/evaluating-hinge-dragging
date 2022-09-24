import Path from "./Path";

const rib = props => {
  const drawNotch = dir => {
    path.move(dir - Math.PI / 2, props.notchDepth);
    path.move(dir, props.notchLength);
    path.move(dir + Math.PI / 2, props.notchDepth);
  };

  const radius = props.insideRadius + props.plasticThickness;
  // Arc length of the digitizer (NOT the mold)
  const arcLengthInside =
    props.insideRadius * (((180 - props.angle) * Math.PI) / 180);
  const flatLength = (props.plasticHeight - arcLengthInside) / 2;

  const path = new Path();
  path.move(0, props.padding);

  // Right Slant
  let dir = ((props.angle + 180) * Math.PI) / 180;
  path.move(dir, props.notchEdgeInset);
  drawNotch(dir);
  // @TODO: VERIFY this is non-negative
  path.move(
    dir,
    flatLength -
      props.notchLength * 2 -
      props.notchEdgeInset -
      props.notchCurveInset
  );
  drawNotch(dir);
  path.move(dir, props.notchCurveInset);

  // Curve
  path.circle(
    radius,
    radius * Math.cos(dir + Math.PI / 2),
    radius * Math.sin(dir + Math.PI / 2) - radius
  );

  // Top side with 2 notches
  path.move(0, props.notchCurveInset);
  drawNotch(0);
  path.move(
    0,
    flatLength -
      props.notchLength * 2 -
      props.notchEdgeInset -
      props.notchCurveInset
  );
  drawNotch(0);
  path.move(0, props.notchEdgeInset);

  // Right side
  path.move(-Math.PI / 2, props.padding);

  // Bottom side, with two notches
  const bottomLength = path.x - path.startPos;
  path.move(Math.PI, props.notchEdgeInset);
  drawNotch(Math.PI);
  path.move(Math.PI, bottomLength - 2 * (props.notchEdgeInset + props.notchLength));
  drawNotch(Math.PI);
  path.move(Math.PI, props.notchEdgeInset);

  // Left side, with two notches
  const leftLength = path.y - path.startPos;
  path.move(Math.PI / 2, props.notchEdgeInset);
  drawNotch(Math.PI / 2);
  path.move(Math.PI / 2, leftLength - 2 * (props.notchEdgeInset + props.notchLength));
  drawNotch(Math.PI / 2);
  path.move(Math.PI / 2, props.notchEdgeInset);

  path.close();

  return {
    paths: [path.toString()],
    dims: path.dims(),
  };
};

export default rib;
