import styled from "@emotion/styled";
import { Position } from "../../tasks/tasks";

interface Props {
  position: Position;
}

const touchSize = 30;
const TouchPoint = styled.div`
  background-color: #f00;
  position: absolute;
  width: ${touchSize}px;
  height: ${touchSize}px;
  border-radius: 50%;
  left: ${({ position: { x } }: Props) => x - touchSize / 2}px;
  top: ${({ position: { y } }: Props) => y - touchSize / 2}px;
`;

export default TouchPoint;
