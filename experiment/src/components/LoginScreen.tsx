import styled from "@emotion/styled";
import { Button, TextField } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import Screen from "./generic/Screen";

const Title = styled.h3`
  font-size: 2rem;
  margin: 20px;
`;
const Field = styled.div`
  display: flex;
  align-items: center;
  & > div {
    margin: 10px;
  }
`;

interface Props {
  getLink: (pid: string) => string;
}

const LoginScreen = ({ getLink }: Props) => {
  const [pid, setPid] = React.useState("");
  const nav = useNavigate();
  return (
    <Screen>
      <Title>Enter your participant ID below.</Title>
      <Field>
        <TextField
          label="Participant ID"
          variant="filled"
          value={pid}
          onChange={(e) => setPid(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") nav(getLink(pid));
          }}
        />
        <Button variant="contained" onClick={() => nav(getLink(pid))}>
          Start
        </Button>
      </Field>
    </Screen>
  );
};

export default LoginScreen;
