import React from "react";
import styled from "@emotion/styled";
import theme from "../../theme";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { getTouchPos } from "../../utils/events";
import { fromEvent } from "rxjs";
import { throttleTime } from "rxjs/operators";

const defaultHeight = "4rem";
const Background = styled.div`
  background-color: ${theme.palette.overlay.default};
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  top: calc(50vh - ${({ height }) => height || defaultHeight} / 2);
  height: ${({ height }) => height || defaultHeight};
  left: ${({ left }) => left}px;
  width: 100vw;
  transition: all 0.2s;
`;
const delta = 35;
const pulloutDistance = 100;

function HiddenBar({ isLeft, children, height: barHeight }) {
  const [pos, setPos] = React.useState(0);
  const { width, height } = useWindowDimensions();

  React.useEffect(() => {
    setPos(isLeft ? -width : width);
  }, [width, isLeft]);

  React.useEffect(() => {
    let endSubs = [];
    let startX = 0;
    let currOffset = 0;

    const onMove = e => {
      if (endSubs.length === 0) return;
      currOffset = startX - getTouchPos(e).x;
      setPos((isLeft ? -width : 0) + startX - currOffset);
    };

    const onEnd = e => {
      if (endSubs.length === 0) return;
      endSubs.forEach(sub => sub.unsubscribe());
      endSubs = [];

      if (Math.abs(currOffset) > pulloutDistance) setPos(0);
      else setPos(isLeft ? -width : width);
    };

    const onStart = e => {
      const pos = getTouchPos(e);
      // Just close the touch bar if we are not on the hinge
      if (pos.y < height / 2 - delta || pos.y > height / 2 + delta) {
        setPos(isLeft ? -width : width);
        return;
      }

      // If it's a swipe at the wrong side, close it up
      if (
        (!isLeft && pos.x < delta * 2) ||
        (isLeft && pos.x > width - delta * 2)
      ) {
        setPos(isLeft ? -width : width);
        return;
      }

      // It's not a valid swipe if it's not at the correct edge
      if (
        (isLeft && pos.x > delta * 2) ||
        (!isLeft && pos.x < width - delta * 2)
      ) {
        return;
      }

      // Otherwise, we're swiping in!
      startX = pos.x;

      endSubs = [
        fromEvent(window, "touchmove").pipe(throttleTime(50)).subscribe(onMove),
        fromEvent(window, "mousemove").pipe(throttleTime(50)).subscribe(onMove),
        fromEvent(window, "touchend").subscribe(onEnd),
        fromEvent(window, "mouseup").subscribe(onEnd),
      ];
    };

    const startSubs = [
      fromEvent(window, "touchstart").subscribe(onStart),
      fromEvent(window, "mousedown").subscribe(onStart),
    ];

    return () => [...endSubs, ...startSubs].forEach(sub => sub.unsubscribe());
  }, [width, height, isLeft]);

  return (
    <Background left={pos} height={barHeight}>
      {children}
    </Background>
  );
}

export default HiddenBar;
