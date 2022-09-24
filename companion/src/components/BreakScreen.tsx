import styled from "@emotion/styled";
import { Button } from "@mui/material";
import Screen from "./generic/Screen";

const Title = styled.h3`
  font-size: 2rem;
  margin: 0;
`;

const Desc = styled.p`
  font-size: 1rem;
  max-width: 400px;
`;

interface Props {
  title: string;
  description?: string;
  onClick?: () => void;
}

const BreakScreen = ({ title, description, onClick }: Props) => {
  return (
    <Screen>
      <Title>{title}</Title>
      {description && (
        <Desc>
          {description}
          {onClick && " When you are ready to begin, click Next below."}
        </Desc>
      )}
      {onClick && (
        <Button variant="contained" onClick={onClick}>
          Next
        </Button>
      )}
    </Screen>
  );
};

export default BreakScreen;
