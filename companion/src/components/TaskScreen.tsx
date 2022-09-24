import styled from "@emotion/styled";
import { DragStatus } from "../clients/Database";
import Screen from "./generic/Screen";

const ColourScreen = styled(Screen)`
  background-color: ${({ status }: Props) =>
    status === DragStatus.SUCCESS
      ? "#8aff9f"
      : status === DragStatus.ERROR
      ? "#ffabab"
      : "white"};
`;

const TargetText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  font-size: 4rem;
`;

interface Props {
  target: string;
  status: DragStatus;
}

const TaskScreen = (props: Props) => (
  <ColourScreen {...props}>
    <TargetText>{props.target}</TargetText>
  </ColourScreen>
);

export default TaskScreen;
