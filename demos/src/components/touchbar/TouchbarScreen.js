import React from "react";
import styled from "@emotion/styled";
import BgImage from "../util/BgImage";
import Screen from "../util/Screen";
import img from "./screenshots/bg.jpg";
import Touchbar from "./Touchbar";
import MultitaskBar from "./multitask/MultitaskBar";
import HalfImg from "../window/screenshots/half.jpg";

const Window = styled(BgImage)`
  height: 50vh;
  top: ${({ isBottom }) => (isBottom ? "50vh" : 0)};
`;

function TouchbarScreen() {
  const [isBottom, setIsBottom] = React.useState(null);
  return (
    <Screen>
      <BgImage src={img} draggable={false} />
      {isBottom !== null && <Window src={HalfImg} isBottom={isBottom} />}
      <Touchbar />
      <MultitaskBar onMove={setIsBottom} />
    </Screen>
  );
}

export default TouchbarScreen;
