import styled from "@emotion/styled";
import { DragStatus } from "../../tasks/DragEvents";

interface Props {
  status: DragStatus;
}

const TargetText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  border-radius: 50%;
  font-size: 4rem;
  height: 8rem;
  width: 8rem;
  background-color: ${({ status }: Props) =>
    status === DragStatus.SUCCESS
      ? "green"
      : status === DragStatus.ERROR
      ? "red"
      : "white"};
`;

export default TargetText;
