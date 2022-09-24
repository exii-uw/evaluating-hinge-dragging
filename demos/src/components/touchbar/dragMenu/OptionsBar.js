import styled from "@emotion/styled";
import theme from "../../../theme";
import BarButton from "../BarButton";
import { optionsWidth, getLeftSide } from "./constants";

const Container = styled.div`
  position: absolute;
  height: 4rem;
  top: 0;
  left: ${({ nOptions }) => getLeftSide(nOptions)}px;
  opacity: ${({ isDragging }) => (isDragging ? 1 : 0)};
  display: flex;
  flex-direction: row;
  ${({ isDragging }) =>
    !isDragging &&
    `
  touch-action: none;
  pointer-events: none;
  `}
`;

const OptionButton = styled(BarButton)`
  width: ${optionsWidth}px;
  &:active {
    background-color: ${theme.palette.overlay.light};
  }
`;

function OptionsBar({ options, isDragging, nullImg }) {
  return (
    <Container nOptions={options.length} isDragging={isDragging}>
      {options.map(opt => {
        if (opt) return <OptionButton key={opt}>{opt}</OptionButton>;
        return <OptionButton src={nullImg} key="null" />;
      })}
    </Container>
  );
}

export default OptionsBar;
