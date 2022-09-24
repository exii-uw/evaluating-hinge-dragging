import Path from "./Path";

const concaveRib = props => {
  const path = new Path();

  const drawNotch = dir => {
    path.move(dir - Math.PI / 2, props.notchDepth);
    path.move(dir, props.notchLength);
    path.move(dir + Math.PI / 2, props.notchDepth);
  };

  const topLength = props.plasticHeight / 2;
  const botLength = props.plasticHeight / 2;

  // Top
  path.move(0, props.notchEdgeInset);
  drawNotch(0);
  const distBetweenNotchesT =
    (topLength -
      props.padding -
      2 * props.notchEdgeInset -
      props.nNotches * props.notchLength) /
    (props.nNotches - 1);
  for (let i = 1; i < props.nNotches; i++) {
    path.move(0, distBetweenNotchesT);
    drawNotch(0);
  }
  path.move(0, props.notchEdgeInset);

  // Slant section
  const angle = ((props.angle - 90) / 180) * Math.PI;
  // This is the length of the bottom during the slanted section
  const botPadding = props.padding / Math.cos(angle);
  path.move(
    Math.atan2(-props.padding, botPadding),
    Math.sqrt(Math.pow(props.padding, 2) + Math.pow(botPadding, 2))
  );

  // Downward section, slanted at the angle
  const offset = botPadding * Math.sin(angle);
  path.move(angle - Math.PI / 2, props.notchEdgeInset);
  drawNotch(angle - Math.PI / 2);
  const distBetweenNotchesB =
    (botLength -
      props.padding -
      2 * props.notchEdgeInset -
      props.nNotches * props.notchLength) /
    (props.nNotches - 1);
  for (let i = 1; i < props.nNotches; i++) {
    path.move(angle - Math.PI / 2, distBetweenNotchesB);
    drawNotch(angle - Math.PI / 2);
  }
  path.move(angle - Math.PI / 2, props.notchEdgeInset);

  // Bottom part 1
  path.move(angle + Math.PI, (props.padding - props.notchLength) / 2);
  drawNotch(angle + Math.PI);
  path.move(angle + Math.PI, (props.padding - props.notchLength) / 2);

  // Upward section
  path.move(angle + Math.PI / 2, props.notchEdgeInset);
  drawNotch(angle + Math.PI / 2);
  for (let i = 1; i < props.nNotches; i++) {
    path.move(angle + Math.PI / 2, distBetweenNotchesB);
    drawNotch(angle + Math.PI / 2);
  }
  path.move(angle + Math.PI / 2, props.notchEdgeInset + offset);

  // Bottom part 2
  path.move(Math.PI, props.notchEdgeInset);
  drawNotch(Math.PI);
  for (let i = 1; i < props.nNotches; i++) {
    path.move(Math.PI, distBetweenNotchesT);
    drawNotch(Math.PI);
  }
  path.move(Math.PI, props.notchEdgeInset);

  // Move up
  path.move(Math.PI / 2, (props.padding - props.notchLength) / 2);
  drawNotch(Math.PI / 2);
  path.move(Math.PI / 2, (props.padding - props.notchLength) / 2);

  path.close();

  const hole1 = `M ${
    path.startPos +
    topLength +
    botPadding / 2 -
    props.padding -
    props.boltRadius
  } ${path.startPos + props.padding}
  a ${props.boltRadius} ${props.boltRadius} 0 0 1 ${props.boltRadius * 2} 0
  a ${props.boltRadius} ${props.boltRadius} 0 0 1 ${-props.boltRadius * 2} 0 Z`;

  const hole2 = `M ${
    path.startPos + topLength - props.padding - props.boltRadius
  } ${path.startPos + props.padding * 0.5}
  a ${props.boltRadius} ${props.boltRadius} 0 0 1 ${props.boltRadius * 2} 0
  a ${props.boltRadius} ${props.boltRadius} 0 0 1 ${-props.boltRadius * 2} 0 Z`;

  return {
    paths: [path.toString(), hole1, hole2],
    dims: path.dims(),
  };
};

export default concaveRib;
