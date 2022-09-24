import React from "react";
import styled from "@emotion/styled";
import { BoundingBox } from "../../tasks/tasks";

const SVGBox = styled.div`
  opacity: 0.5;
  position: absolute;
  width: ${({ box }: BoxProps) => box.width}px;
  height: ${({ box }: BoxProps) => box.height}px;
  top: ${({ box }: BoxProps) => box.top}px;
  left: ${({ box }: BoxProps) => box.left}px;
`;

interface BoxProps {
  box: BoundingBox;
}

interface Props extends BoxProps {
  sr: number; // small radius
  lr: number; // large radius
  nSegments: number;
}

const getFill = (idx: number) => {
  switch (idx % 3) {
    case 0:
      return "#FFEDB5";
    case 1:
      return "#D49FB2";
    case 2:
      return "#A2C1DC";
  }
};

const ColourWheel = ({ nSegments, sr, lr, box }: Props) => {
  const circleAngles = new Array(nSegments)
    .fill(0)
    .map((_, idx) => Math.PI / 2 - (idx * (2 * Math.PI)) / nSegments);
  const deltaA = Math.PI / nSegments;
  return (
    <SVGBox box={box}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1">
        {circleAngles.map((a, idx) => (
          <path
            key={a}
            d={`M ${0.5 + Math.cos(a - deltaA) * sr} ${
              0.5 - Math.sin(a - deltaA) * sr
            } L ${0.5 + Math.cos(a - deltaA) * lr} ${
              0.5 - Math.sin(a - deltaA) * lr
            } A ${lr} ${lr} 0 0 0 ${0.5 + Math.cos(a + deltaA) * lr} ${
              0.5 - Math.sin(a + deltaA) * lr
            } L ${0.5 + Math.cos(a + deltaA) * sr} ${
              0.5 - Math.sin(a + deltaA) * sr
            } A ${sr} ${sr} 0 0 1 ${0.5 + Math.cos(a - deltaA) * sr} ${
              0.5 - Math.sin(a - deltaA) * sr
            } Z`}
            fill={getFill(idx)}
          />
        ))}
      </svg>
    </SVGBox>
  );
};

export default ColourWheel;
