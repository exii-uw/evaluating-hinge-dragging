import React from "react";
import styled from "@emotion/styled";
import BarButton from "../BarButton";
import { fromEvent } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { getOptionIdx } from "./constants";
import { getTouchPos } from "../../../utils/events";
import OptionsBar from "./OptionsBar";

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

function DragMenu({ options, hideIcon, setHideIcons, offImg, onImg }) {
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current) return;
    let endSubs = [];
    let startX = 0;
    let currOffset = 0;
    
    const onMove = e => {
      if (endSubs.length === 0) return;
      currOffset = startX - getTouchPos(e).x;
    }

    const onEnd = e => {
      if (endSubs.length === 0) return;
      endSubs.forEach(sub => sub.unsubscribe());
      endSubs = [];
      setIsDragging(false);
      setHideIcons(false);

      // Change which item is selected
      let newSelectedIdx = getOptionIdx(-currOffset, options.length);
      if (newSelectedIdx >= selectedIdx) newSelectedIdx += 1;
      // Only update if we actually changed the selected index
      if (newSelectedIdx < options.length) setSelectedIdx(newSelectedIdx);
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
  }, [setHideIcons, selectedIdx, options]);

  const sortedOptions = [...options, options[selectedIdx]];
  sortedOptions.splice(selectedIdx, 1);

  return (
    <Container ref={ref} isDragging={isDragging}>
      <OptionsBar
        options={sortedOptions}
        isDragging={isDragging}
        nullImg={offImg}
      />
      <BarButton
        src={options[selectedIdx] === null ? offImg : onImg}
        hidden={isDragging}
        hideIcon={hideIcon}
      />
    </Container>
  );
}

export default DragMenu;
