import React from "react";
import styled from "@emotion/styled";
import FileItem from "./FileItem";
import Icon from "../util/Icon";
import CopyIcon from "./icons/copy.svg";
import RenameIcon from "./icons/rename.svg";
import ShareIcon from "./icons/share.svg";
import OpenIcon from "./icons/open.svg";
import ShareMailIcon from "./icons/share_mail.svg";
import SharePresentIcon from "./icons/share_present.svg";
import ShareSMSIcon from "./icons/share_sms.svg";
import OpenPreviewIcon from "./icons/open_preview.svg";
import OpenEditIcon from "./icons/open_edit.svg";
import { dragState } from "./constants";

const ForegroundIcon = styled(Icon)`
  z-index: 3;
`;

const defaultFiles = [
  "README.txt",
  "Invoice.docx",
  "Resume.pdf",
  "tbd.jpg",
  "notes.txt",
  "code.js",
];

const Container = styled.div`
  height: 100%;
  background-color: #353535;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
`;

const icons = {
  [dragState.IDLE]: [],
  [dragState.DEFAULT]: [
    { icon: CopyIcon, fraction: 1 / 8 },
    { icon: RenameIcon, fraction: 3 / 8 },
    { icon: ShareIcon, fraction: 5 / 8 },
    { icon: OpenIcon, fraction: 7 / 8 },
  ],
  [dragState.SHARE]: [
    { icon: ShareMailIcon, fraction: 1 / 8 },
    { icon: SharePresentIcon, fraction: 3 / 8 },
    { icon: ShareSMSIcon, fraction: 7 / 8 },
  ],
  [dragState.OPEN]: [
    { icon: OpenPreviewIcon, fraction: 3 / 8 },
    { icon: OpenEditIcon, fraction: 5 / 8 },
  ],
};

function FileItemBox({ open }) {
  const numFiles = React.useRef(defaultFiles.length);
  const [files, setFiles] = React.useState(
    defaultFiles.reduce((acc, name, idx) => ({ ...acc, [idx]: name }), {})
  );
  const [state, setState] = React.useState(dragState.IDLE);

  const duplicate = React.useCallback(
    name => {
      setFiles(files => ({
        ...files,
        [numFiles.current++]: name,
      }));
    },
    [setFiles]
  );

  const rename = React.useCallback(
    (idx, newName) => {
      setFiles(files => ({
        ...files,
        [idx]: newName,
      }));
    },
    [setFiles]
  );

  return (
    <Container>
      {Object.entries(files).map(([idx, file]) => (
        <FileItem
          idx={idx}
          name={file}
          key={idx}
          setState={setState}
          duplicate={duplicate}
          rename={rename}
          open={open}
        />
      ))}
      {Object.entries(icons).flatMap(([s, subicons]) =>
        subicons.map((ico, i) => (
          <ForegroundIcon
            key={`icon ${i} for state ${s}`}
            src={ico.icon}
            opacity={state === s ? 1 : 0}
            fraction={ico.fraction}
            isVertical={true}
            white
          />
        ))
      )}
    </Container>
  );
}

export default FileItemBox;
