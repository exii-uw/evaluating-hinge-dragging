import Path from "./Path";

const curve = props => {
  const path = new Path();

  // Start with a notch to fit
  path.move(0, props.notchEdgeInset);

  // Get the x, y location of the point where the circle (of the curve)
  // reaches the angled right side.
  // Relative coordinates from the top right of the top of the line, if the
  // curve was replaced with straight lines
  const angle = ((props.angle - 90) / 180) * Math.PI;
  // Technically, tangentY is negative
  const tangentY = -props.insideRadius * (1 - Math.sin(angle));
  const tangentX = Math.tan(angle) * -tangentY;

  // Now, determine how far the straight line goes
  const botPadding = props.padding / Math.cos(angle);
  path.move(
    0,
    botPadding -
      props.insideRadius * Math.cos(angle) -
      props.padding * Math.tan(angle) +
      tangentX
  );
  path.circle(
    props.insideRadius,
    props.insideRadius * Math.cos(angle),
    props.insideRadius * (Math.sin(angle) - 1),
    "0 0 1"
  );
  path.move(-Math.PI / 2 + angle, (props.padding + tangentY) / Math.cos(angle));

  // Go a little further
  path.move(-Math.PI / 2 + angle, props.notchEdgeInset);

  // Bottom
  path.move(-Math.PI + angle, props.padding);

  // Upward slant
  const offset = botPadding * Math.sin(angle);
  path.move(
    angle + Math.PI / 2,
    props.notchEdgeInset + offset
  );

  // Bottom 2
  path.move(Math.PI, props.notchEdgeInset);

  // End
  path.move(Math.PI / 2, props.padding);
  path.close();

  const hole1 = `M ${
    path.startPos + props.notchEdgeInset + botPadding / 2 - props.boltRadius
  } ${path.startPos + props.padding}
  a ${props.boltRadius} ${props.boltRadius} 0 0 1 ${props.boltRadius * 2} 0
  a ${props.boltRadius} ${props.boltRadius} 0 0 1 ${-props.boltRadius * 2} 0 Z`;

  const hole2 = `M ${path.startPos + props.notchEdgeInset - props.boltRadius} ${
    path.startPos + props.padding * 0.5
  }
  a ${props.boltRadius} ${props.boltRadius} 0 0 1 ${props.boltRadius * 2} 0
  a ${props.boltRadius} ${props.boltRadius} 0 0 1 ${-props.boltRadius * 2} 0 Z`;

  return {
    paths: [path.toString(), hole1, hole2],
    dims: path.dims(),
  };
};

export default curve;
