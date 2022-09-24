import React from "react";
import styled from "@emotion/styled";
import { Position } from "../../tasks/tasks";

interface Props {
  size: number;
  position: Position;
  label?: string | number;
  labelAngle?: number;
  bold: boolean;
}

const thickness = 2;

const Vertical = styled.div`
  background-color: #000;
  position: absolute;
  top: ${({ position, size }: Props) => position.y - 0.5 * size}px;
  left: ${({ position }: Props) => position.x - 0.5 * thickness}px;
  width: ${thickness}px;
  height: ${({ size }: Props) => size}px;
`;

const Horizontal = styled.div`
  background-color: #000;
  position: absolute;
  top: ${({ position }: Props) => position.y - 0.5 * thickness}px;
  left: ${({ position, size }: Props) => position.x - 0.5 * size}px;
  width: ${({ size }: Props) => size}px;
  height: ${thickness}px;
`;

const textWidth = 32;
const textHeight = 32;

const TextBox = styled.div`
  position: absolute;
  color: #000;
  font-size: 2rem;
  width: ${textWidth}px;
  height: ${textWidth}px;
  margin: 0;
  padding: 0;
  top: ${({ position, labelAngle }: Props) =>
    position.y - textHeight / 2 - textHeight * Math.sin(labelAngle || 0)}px;
  left: ${({ position, labelAngle }: Props) =>
    position.x - textWidth / 2 + textWidth * Math.cos(labelAngle || 0)}px;
  font-weight: ${({ bold }: Props) => (bold ? 700 : 300)};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Crosshair = (props: Props) => (
  <>
    <Vertical {...props} />
    <Horizontal {...props} />
    {props.label && <TextBox {...props}>{props.label}</TextBox>}
  </>
);

Crosshair.defaultProps = {
  size: 20,
  bold: false,
};

export default Crosshair;
