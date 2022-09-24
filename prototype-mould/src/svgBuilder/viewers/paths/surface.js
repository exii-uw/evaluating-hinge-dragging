import Path from "./Path";

const surface = props => {
  const topLength = props.plasticHeight / 2;

  const unNotchLength = (topLength - props.padding - 2 * props.notchEdgeInset - props.notchLength * props.nNotches) / (props.nNotches - 1);
  console.log(unNotchLength);
  const distBetweenNotchesV = props.notchLength + unNotchLength;
    // (topLength - props.padding - 2 * props.notchEdgeInset - props.notchLength) /
    // (props.nNotches - 1);
  const startPos = 1;

  const distBetweenNotchesH =
    (props.plasticWidth - 2 * props.notchEdgeInset - props.notchDepth) /
    (props.nRibs - 1);

  const startNotch = idx => `M ${
    startPos + props.notchEdgeInset + distBetweenNotchesH * idx
  } ${startPos + props.notchEdgeInset}
  l ${props.notchDepth} 0
  l 0 ${props.notchEdgeInset}
  l ${-props.notchDepth} 0
  l 0 ${-props.notchEdgeInset}
  Z
  `;

  const regularNotch = (row, col) => `M ${
    startPos + props.notchEdgeInset + distBetweenNotchesH * col
  } ${
    startPos +
    2 * props.notchEdgeInset +
    distBetweenNotchesV * row -
    unNotchLength
  }
  l ${props.notchDepth} 0
  l 0 ${unNotchLength}
  l ${-props.notchDepth} 0
  l 0 ${-unNotchLength}
  Z
  `;

  const makeRow = row =>
    Array(props.nRibs)
      .fill(0)
      .map((_, idx) => regularNotch(row, idx));

  const path = new Path(startPos);
  path.move(0, props.plasticWidth);
  path.move(-Math.PI / 2, topLength - props.padding);
  path.move(Math.PI, props.plasticWidth);
  path.move(Math.PI / 2, topLength - props.padding);
  path.close();

  return {
    paths: [
      path.toString(),
      ...Array(props.nRibs)
        .fill(0)
        .map((_, idx) => startNotch(idx)),
      ...Array(props.nNotches - 1).fill(0).reduce((vals, _, idx) => [...vals, ...makeRow(idx + 1)], [])
    ],
    dims: path.dims(),
  };
};

export default surface;
