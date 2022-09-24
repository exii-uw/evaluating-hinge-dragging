import React from "react";
import styled from "@emotion/styled";

const Background = styled.div`
  background-color: #444;
  padding-bottom: 1rem;
`;

const TopBar = styled.div`
  width: 100%;
  height: 1rem;
  padding: 0.5rem;
`;

const TopTitle = styled.div`
  width: 100%;
  text-align: center;
  color: white;
`;

const BottomBar = styled.div`
  height: 2rem;
  width: 100%;
`;

const AddressBox = styled.div`
  border-radius: 0.2rem;
  height: 1.5rem;
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px #999 solid;
  color: #FFF;
`;

function FileManagerHeader() {
  return (
    <Background>
      <TopBar>
        <TopTitle>File Manager</TopTitle>
      </TopBar>
      <BottomBar>
        <AddressBox>/Users/john/Documents/</AddressBox>
      </BottomBar>
    </Background>
  );
}

export default FileManagerHeader;
