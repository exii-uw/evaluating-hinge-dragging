import Path from "./Path";

const cross = props => {
  const path = new Path();
  const betweenLength =
    (props.plasticWidth -
      2 * props.notchEdgeInset -
      props.nRibs * props.notchDepth) /
    (props.nRibs - 1);

  const makeNotch = angle => {
    path.move(angle - Math.PI / 2, props.notchDepth);
    path.move(angle, props.notchDepth);
    path.move(angle + Math.PI / 2, props.notchDepth);
  };

  const makeEdge = angle => {
    path.move(angle, props.notchEdgeInset);
    makeNotch(angle);
    for (let i = 0; i < props.nRibs - 1; i++) {
      path.move(angle, betweenLength);
      makeNotch(angle);
    }
    path.move(angle, props.notchEdgeInset);
    path.move(angle - Math.PI / 2, props.notchDepth * 2 + props.notchLength);
  };

  makeEdge(0);
  makeEdge(Math.PI);
  path.close();

  return {
    paths: [path.toString()],
    dims: path.dims(),
  };
};

export default cross;
