import React from "react";
import styled from "@emotion/styled";
import theme from "../../../theme";
import TouchbarIcon from "../TouchbarIcon";

const Point = styled.div`
  position: relative;
  left: ${({ offset }) => offset}px;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: ${theme.palette.overlay.default};
  width: ${({ isDragging }) => (isDragging ? 3 : 5)}rem;
  height: 3rem;
  margin: 0.5rem 0.25rem;
  border-radius: ${({ isDragging }) => (isDragging ? "50%" : "0.5rem")};
  color: white;
  border: none;
  transition: all 0.2s;
  &:hover {
    background-color: ${theme.palette.overlay.light};
  }
  &:active {
    transition: all 0.05s;
    background-color: ${theme.palette.overlay.veryLight};
  }
`;

const SliderPoint = React.forwardRef((props, ref) => {
  return (
    <Point {...props} ref={ref}>
      <TouchbarIcon white opacity={props.hideIcon ? 0 : 1} src={props.src} />
    </Point>
  );
});

export default SliderPoint;
