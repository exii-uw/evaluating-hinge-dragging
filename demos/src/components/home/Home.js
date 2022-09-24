import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import {
  FILES_ROUTE,
  DRAW_ROUTE,
  WINDOW_ROUTE,
  TOUCHBAR_ROUTE,
} from "../../routes";
import theme from "../../theme";

const Screen = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
`;

const ButtonBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
`;

const Button = styled(Link)`
  font-size: 1.25rem;
  padding: 1rem 2rem;
  text-decoration: none;
  background-color: ${theme.palette.primary.default};
  color: #fff;
  transition: all 0.2s;
  border-radius: 1rem;
  margin: 0.5rem;
  width: 100%;
  &:hover {
    background-color: ${theme.palette.primary.light};
  }
`;

function Home() {
  return (
    <Screen>
      <h1>Hinge-based interaction demos</h1>
      <ButtonBar>
        <Button to={TOUCHBAR_ROUTE}>Touchbar App</Button>
        <Button to={WINDOW_ROUTE}>Window Management App</Button>
        <Button to={DRAW_ROUTE}>Drawing App</Button>
        <Button to={FILES_ROUTE}>File Management App</Button>
      </ButtonBar>
    </Screen>
  );
}

export default Home;
