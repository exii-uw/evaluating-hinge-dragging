import styled from "@emotion/styled";

const size = 70;
const Icon = styled.img`
  user-select: none;
  position: absolute;
  left: calc(
    ${({ fraction, isVertical }) =>
      isVertical
        ? `${fraction * 100}vw - ${size / 2}px`
        : `50vw - ${size / 2}px`}
  );
  top: calc(
    ${({ fraction, isVertical }) =>
      isVertical
        ? `50vh - ${size / 2}px`
        : `${fraction * 100}vh - ${size / 2}px`}
  );
  opacity: ${({ opacity }) => opacity};
  width: ${size}px;
  height: ${size}px;
  transition: all 0.1s;
  ${({ white }) => white && "filter: invert(100%) brightness(200%);"}
  transform: rotate(${({ rotate }) => rotate || 0}deg);
`;

export default Icon;
