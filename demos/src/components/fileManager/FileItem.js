import React from "react";
import styled from "@emotion/styled";
import { fromEvent } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { getTouchPos } from "../../utils/events";
import { dragState } from "./constants";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import FileIcon from "./icons/file.svg";
import Icon from "../util/Icon";
import ShareEmail from "./screenshots/share_email.jpg";
import SharePresent from "./screenshots/share_present.jpg";
import ShareMessage from "./screenshots/share_message.jpg";
import OpenPreview from "./screenshots/open_preview.jpg";
import OpenEdit from "./screenshots/open_edit.jpg";

const Container = styled.div`
  border: 1px solid #555;
  background-color: #353535;
  color: #fff;
  width: 12rem;
  height: 12rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: ${({ pos }) => (!pos.x && !pos.y ? 0 : 1)};
  padding: 1rem;
  user-select: none;
  position: relative;
  transition: all 0.2s;
  left: ${({ pos }) => pos.x}px;
  top: ${({ pos }) => pos.y}px;
`;

const StyledIcon = styled(Icon)`
  position: static;
`;

const delta = 50;
const defaultPos = { x: 0, y: 0 };

function FileItem({ idx, name, order, setState, duplicate, rename, open }) {
  const ref = React.useRef(null);
  const [newName, setNewName] = React.useState(name);
  const [pos, setPos] = React.useState(defaultPos);
  const [edit, setEdit] = React.useState(false);
  const { width, height } = useWindowDimensions();

  const onInputAppear = React.useCallback((node) => {
    if (!node) return;
    node.focus();
  }, []);

  React.useEffect(() => {
    if (!ref.current) return;

    let endSubs = [];
    let state = dragState.DEFAULT;
    let startPos = defaultPos;
    let prvPos = defaultPos;
    let currOffset = defaultPos;

    const actions = {
      [dragState.DEFAULT]: [
        { startX: 0, endX: width / 4, action: () => duplicate(name) },
        { startX: width / 4, endX: width / 2, action: () => setEdit(true) },
        {
          startX: width / 2,
          endX: (width * 3) / 4,
          action: () => {
            state = dragState.SHARE;
            setState(dragState.SHARE);
          },
        },
        {
          startX: (width * 3) / 4,
          endX: width,
          action: () => {
            state = dragState.OPEN;
            setState(dragState.OPEN);
          },
        },
      ],
      [dragState.SHARE]: [
        { startX: 0, endX: width / 4, action: () => open(ShareEmail) },
        {
          startX: width / 4,
          endX: width / 2,
          action: () => open(SharePresent),
        },
        {
          startX: (width * 3) / 4,
          endX: width,
          action: () => open(ShareMessage),
        },
      ],
      [dragState.OPEN]: [
        { startX: width / 4, endX: width / 2, action: () => open(OpenPreview) },
        {
          startX: width / 2,
          endX: (width * 3) / 4,
          action: () => open(OpenEdit),
        },
      ],
    };

    const onMove = e => {
      if (endSubs.length === 0) return;
      const currPos = getTouchPos(e);
      currOffset = { x: currPos.x - startPos.x, y: currPos.y - startPos.y };
      setPos(currOffset);

      // To trigger immediate behaviour, must enter the delta zone from outside
      const startHinge = height / 2 - delta;
      const endHinge = height / 2 + delta;
      if (
        (state === dragState.DEFAULT &&
          prvPos.y < startHinge &&
          currPos.y > startHinge) ||
        (state === dragState.DEFAULT &&
          prvPos.y > endHinge &&
          currPos.y < endHinge)
      ) {
        // We just crossed in, do the desired behaviour
        actions[state].forEach(({ startX, endX, action }) => {
          if (currPos.x >= startX && currPos.x < endX) action();
        });
      }
      prvPos = currPos;
    };

    const onEnd = e => {
      if (endSubs.length === 0) return;
      endSubs.forEach(sub => sub.unsubscribe());

      // Perform the action if it's not the default mode
      if (state !== dragState.DEFAULT) {
        actions[state].forEach(({ startX, endX, action }) => {
          if (prvPos.x >= startX && prvPos.x < endX) action();
        });
      }

      state = dragState.DEFAULT;
      setState(dragState.IDLE);
      endSubs = [];
      setPos(defaultPos);
    };

    const onStart = e => {
      if (endSubs.length !== 0) return;
      setState(dragState.DEFAULT);
      startPos = getTouchPos(e);
      prvPos = startPos;

      endSubs = [
        fromEvent(window, "touchmove").pipe(throttleTime(50)).subscribe(onMove),
        fromEvent(window, "mousemove").pipe(throttleTime(50)).subscribe(onMove),
        fromEvent(window, "touchend").subscribe(onEnd),
        fromEvent(window, "mouseup").subscribe(onEnd),
      ];
    };

    const startSubs = [
      fromEvent(ref.current, "touchstart").subscribe(onStart),
      fromEvent(ref.current, "mousedown").subscribe(onStart),
    ];

    return () => [...endSubs, ...startSubs].forEach(sub => sub.unsubscribe());
  }, [setState, name, width, height, duplicate, open]);

  return (
    <Container pos={pos} ref={ref}>
      <StyledIcon draggable={false} white src={FileIcon} />
      {edit ? (
        <input
          ref={onInputAppear}
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyPress={e => {
            if (e.which === 13) {
              e.preventDefault();
              rename(idx, newName);
              setEdit(false);
            }
          }}
        />
      ) : (
        name
      )}
    </Container>
  );
}

export default FileItem;
