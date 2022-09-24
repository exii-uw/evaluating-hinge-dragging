import Path from "./Path";

const back = props => {
  const path = new Path();
  const betweenLength =
    (props.plasticWidth -
      2 * props.notchEdgeInset -
      props.nRibs * props.notchDepth) /
    (props.nRibs - 1);

  // Ignore notchDepth prop; that's for the other notches
  // in other svgs. Thiss is different.
  const notchDepth = (props.padding - props.notchLength) / 2 - props.notchDepth;
  const totalHeight = props.notchLength + 2 * notchDepth;

  const makeNotch = (angle, depth) => {
    path.move(angle - Math.PI / 2, depth);
    path.move(angle, props.notchDepth);
    path.move(angle + Math.PI / 2, depth);
  };

  const makeEdge = (angle, depth = props.notchDepth) => {
    path.move(angle, props.notchEdgeInset);
    makeNotch(angle, depth);
    for (let i = 0; i < props.nRibs - 1; i++) {
      path.move(angle, betweenLength);
      makeNotch(angle, depth);
    }
    path.move(angle, props.notchEdgeInset);
    path.move(angle - Math.PI / 2, totalHeight);
  };

  makeEdge(0, notchDepth);
  makeEdge(Math.PI, notchDepth);
  path.close();

  return {
    paths: [path.toString()],
    dims: path.dims(),
  };
};

export default back;
