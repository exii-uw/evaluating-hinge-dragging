import React from "react";
import styled from "@emotion/styled";
import Screen from "../util/Screen";
import FileManagerHeader from "./FileManagerHeader";
import FileItemContainer from "./FileItemContainer";

const Image = styled.img`
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
`;


function FileManagerScreen() {
  const [img, setImg] = React.useState(null);

  return (
    <Screen>
      <FileManagerHeader />
      <FileItemContainer open={setImg} />
      {img && <Image src={img} onClick={() => setImg(null)} />}
    </Screen>
  );
}

export default FileManagerScreen;
