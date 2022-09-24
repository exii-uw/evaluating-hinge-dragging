import styled from "@emotion/styled";

const TouchbarIcon = styled.img`
  ${({ white }) => white && "filter: invert(100%) brightness(200%);"}
  width: 2rem;
  height: 2rem;
  user-select: none;
  pointer-events: none;
  transition: all 0.2s;
  opacity: ${({ opacity }) => opacity};
`;

export default TouchbarIcon;
