import styled from "@emotion/styled";
import { Position } from "../../tasks/tasks";
import Crosshair from "../dragScreen/Crosshair";

const size = 80;

const Circle = styled.div`
  background-color: ${({ completion }: Props) =>
    completion >= 1 ? "#52eb34" : "#ccc"};
  position: absolute;
  top: ${({ position, completion }: Props) =>
    position.y - (completion * size) / 2}px;
  left: ${({ position, completion }: Props) =>
    position.x - (completion * size) / 2}px;
  width: ${({ completion }: Props) => completion * size}px;
  height: ${({ completion }: Props) => completion * size}px;
  border-radius: 50%;
`;

interface Props {
  position: Position;
  completion: number; // in [0, 1]
}

const CalibrationTarget = (props: Props) => {
  return (
    <>
      <Circle {...props} />
      <Crosshair position={props.position} size={80} />
    </>
  );
};

export default CalibrationTarget;
