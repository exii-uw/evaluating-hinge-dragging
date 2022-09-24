import React from "react";
import styled from "@emotion/styled";
import SliderPoint from "./SliderPoint";
import SliderBar from "./SliderBar";
import { getTouchPos } from "../../../utils/events";
import { fromEvent } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { constrain, constrainDx } from "./constants";

const Container = styled.div`
  z-index: ${({ isDragging }) => (isDragging ? 2 : 1)};
  position: relative;
  width: 5.5rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
`;

function Slider({ setHideIcons, hideIcon, onImg, offImg }) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [value, setValue] = React.useState({ x: 0, dx: 0 });
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current) return;
    let startX = 0;
    let endSubs = [];

    const onMove = e => {
      if (endSubs.length === 0) return;
      setValue(value => ({ ...value, dx: getTouchPos(e).x - startX }));
    };

    const onEnd = e => {
      if (endSubs.length === 0) return;
      endSubs.forEach(sub => sub.unsubscribe());
      endSubs = [];
      setIsDragging(false);
      setHideIcons(false);
      setValue(value => ({ x: constrain(value.x + value.dx), dx: 0 }));
    };

    const onStart = e => {
      if (endSubs.length !== 0) return;
      setIsDragging(true);
      setHideIcons(true);
      startX = getTouchPos(e).x;

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
  }, [setHideIcons]);

  return (
    <Container isDragging={isDragging}>
      <SliderBar
        isDragging={isDragging}
        x={-value.x}
        offImg={offImg}
        onImg={onImg}
      />
      <SliderPoint
        offset={constrainDx(value.dx, value.x)}
        isDragging={isDragging}
        hideIcon={hideIcon}
        src={value.x === 0 ? offImg : onImg}
        ref={ref}
      />
    </Container>
  );
}

export default Slider;
