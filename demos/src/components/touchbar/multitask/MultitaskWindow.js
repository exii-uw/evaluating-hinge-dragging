import React from "react";
import styled from "@emotion/styled";
import { fromEvent } from "rxjs";
import { throttleTime } from "rxjs/operators";
import DraggableImg from "../../window/screenshots/draggable.png";
import { getTouchPos } from "../../../utils/events";

const delta = 100;
const Window = styled.img`
  display: inline-flex;
  position: relative;
  top: ${({pos}) => pos.y}px;
  left: ${({pos}) => pos.x}px;
  width: 10 rem;
  height: 8rem;
  margin: 0.5 rem 0.25rem;
`;

// onMove takes a boolean with whether it's supposed to tile
// to the bottom (true) or top (false).
function MultitaskWindow({ onMove: onMoveWindow }) {
  const ref = React.useRef(null);
  const [pos, setPos] = React.useState(0);

  React.useEffect(() => {
    if(!ref.current) return;
    let currOffset = {x: 0, y: 0};
    let startPos = {x: 0, y: 0};
    let endSubs = [];

    const onMove = e => {
      if (endSubs.length === 0) return;
      const currPos = getTouchPos(e);
      currOffset = {x: currPos.x - startPos.x, y: currPos.y - startPos.y};
      setPos(currOffset);
    };

    const onEnd = e => {
      if (endSubs.length === 0) return;
      endSubs.forEach(sub => sub.unsubscribe());
      endSubs = [];
      setPos({x: 0, y: 0});

      if (Math.abs(currOffset.y) > delta) {
        onMoveWindow(currOffset.y > 0);
      }
    };

    const onStart = e => {
      if (endSubs.length !== 0) return;
      startPos = getTouchPos(e);

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
  }, [onMoveWindow]);

  return (
    <Window draggable={false} pos={pos} ref={ref} src={DraggableImg} />
  );
}

export default MultitaskWindow;
