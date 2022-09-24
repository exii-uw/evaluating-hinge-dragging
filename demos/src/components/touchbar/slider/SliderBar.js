import styled from "@emotion/styled";
import theme from "../../../theme";
import { maxValue, minValue } from "./constants";
import TouchbarIcon from "../TouchbarIcon";

const Container = styled.div`
  position: absolute;
  height: 4rem;
  left: calc(${({ x }) => x}px - 4.5rem);
  opacity: ${({ isDragging }) => (isDragging ? 1 : 0)};
  display: flex;
  flex-direction: row;
  touch-action: none;
  pointer-events: none;
`;

const IconContainer = styled.div`
  height: 4rem;
  width: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Bar = styled.div`
  height: 4rem;
  width: calc(4.5rem + ${maxValue - minValue}px);
  background-color: ${theme.palette.overlay.veryLight};
  border-radius: 2rem;
`;

const SliderBar = props => {
  return (
    <Container x={props.x} isDragging={props.isDragging}>
      <IconContainer>
        <TouchbarIcon white src={props.offImg} />
      </IconContainer>
      <Bar />
      <IconContainer>
        <TouchbarIcon white src={props.onImg} />
      </IconContainer>
    </Container>
  );
};

export default SliderBar;
