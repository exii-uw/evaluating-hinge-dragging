import React from "react";
import styled from "@emotion/styled";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { fromEvent } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { getTouchPos } from "../../utils/events";

const Circle = styled.div`
  position: absolute;
  left: ${({ x, size }) => x - size / 2}px;
  top: ${({ y, size }) => y - size / 2}px;
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
  border-radius: 50%;
  background-color: ${({ colour }) => colour};
  transition: all 0.2s;
  cursor: pointer;
`;

function DraggableCircle({ id, onStartDrag, onEndDrag, onDrag, x, y, colour, size }) {
  const { width, height } = useWindowDimensions();
  const ref = React.useRef(null);

  // Make sure this does not depend on x or y
  React.useEffect(() => {
    if (!ref.current) return;
    const isVertical = width < height;
    const hingeX = width / 2;
    const hingeY = height / 2;

    let endSubs = [];
    let prvPos = { x: 0, y: 0 };

    const onMove = e => {
      if (endSubs.length === 0) return;
      const pos = getTouchPos(e);

      // If cross down
      const crossed = isVertical
        ? (prvPos.y < hingeY && pos.y >= hingeY) ||
          (prvPos.y >= hingeY && pos.y < hingeY)
          ? prvPos.x / width
          : false
        : (prvPos.x < hingeX && pos.x >= hingeX) ||
          (prvPos.x >= hingeX && pos.x < hingeX)
        ? prvPos.y / height
        : false;
      onDrag(pos, crossed, id);
      prvPos = pos;
    };

    const onEnd = e => {
      if (endSubs.length === 0) return;
      if ((e.x && e.y) || e.touches.length === 0) {
        endSubs.forEach(sub => sub.unsubscribe());
        endSubs = [];
        onEndDrag(id);
      }
    };

    const onStart = e => {
      if (endSubs.length !== 0) return;
      onStartDrag(id);
      prvPos = getTouchPos(e);
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
  }, [id, onStartDrag, onEndDrag, onDrag, width, height]);

  return <Circle ref={ref} x={x} y={y} colour={colour} size={size} />;
}

export default DraggableCircle;
