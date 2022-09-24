import styled from "@emotion/styled";
import theme from "../../theme";
import TouchbarIcon from "./TouchbarIcon";

const Button = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: ${theme.palette.overlay.default};
  width: 5rem;
  height: 3rem;
  margin: 0.5rem 0.25rem;
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
  border: none;
  transition: all 0.2s;
  opacity: ${({ hidden }) => (hidden ? 0 : 1)};
  ${({ hidden }) =>
    hidden &&
    `
  touch-action: none;
  pointer-events: none;
  `}
  &:hover {
    background-color: ${theme.palette.overlay.light};
  }
  &:active {
    transition: all 0s;
    background-color: ${theme.palette.overlay.veryLight};
  }
`;

function BarButton({ hidden, src, onClick, hideIcon, children, className }) {
  return (
    <Button onClick={onClick} className={className} hidden={hidden}>
      {src && <TouchbarIcon white src={src} opacity={hideIcon ? 0 : 1} />}
      {children}
    </Button>
  );
}

export default BarButton;
