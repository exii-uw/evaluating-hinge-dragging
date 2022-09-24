import React from "react";
import styled from "@emotion/styled";
import { fromEvent } from "rxjs";
import { throttleTime } from "rxjs/operators";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import CloseIcon from "./icons/Close.svg";
import FullIcon from "./icons/Full Screen.svg";
import RightIcon from "./icons/Right.svg";
import LeftIcon from "./icons/Left.svg";
import Icon from "../util/Icon";

import DraggableWindowImg from "./screenshots/draggable.png";
import HalfWindow from "./screenshots/half.jpg";
import HalfHorizWindow from "./screenshots/half-horiz.jpg";
import QuarterWindow from "./screenshots/quarter.jpg";
import QuarterHorizWindow from "./screenshots/quarter-horiz.jpg";

const defaultSpeed = 0.05;

const Box = styled.img`
  user-select: none;
  position: absolute;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background-color: ${({ isHidden, isDragging }) =>
    isHidden ? "#fff" : isDragging ? "#99f" : "#bbf"};
  opacity: ${({ src }) => (src ? 1 : 0)};
  transition: all ${({ speed }) => speed || 0}s;
`;

const State = {
  FOLLOW: "FOLLOW",
  TOP: "TOP",
  BOTTOM: "BOTTOM",
  TOP_LEFT: "TOP_LEFT",
  BOT_LEFT: "BOT_LEFT",
  TOP_RIGHT: "TOP_RIGHT",
  BOT_RIGHT: "BOT_RIGHT",
  FULL: "FULL",
  HIDDEN: "HIDDEN",
};

const crossUpStates = [
  State.TOP_LEFT,
  State.TOP,
  State.HIDDEN,
  State.TOP_RIGHT,
];
const crossDownStates = [
  State.BOT_LEFT,
  State.BOTTOM,
  State.HIDDEN,
  State.BOT_RIGHT,
];

function DraggableWindow() {
  const ref = React.useRef(null);
  const { width, height } = useWindowDimensions();
  const [shortSideLen, longSideLen, isVertical] =
    width < height ? [width, height, true] : [height, width, false];
  const [state, setState] = React.useState(State.TOP);
  const [speed, setSpeed] = React.useState(defaultSpeed);
  const [isDragging, setIsDragging] = React.useState(false);
  const [pos, setPos] = React.useState({ shortDir: 0, longDir: 0 });

  // TODO: use an event to listen to window size change
  React.useEffect(() => {
    setSpeed(0);
    if (isVertical) {
      setState(state => {
        switch (state) {
          case State.TOP_LEFT:
            return State.TOP_RIGHT;
          case State.TOP_RIGHT:
            return State.TOP_LEFT;
          case State.BOT_LEFT:
            return State.BOT_RIGHT;
          case State.BOT_RIGHT:
            return State.BOT_LEFT;
          default:
            return state;
        }
      });
    } else {
      setState(state => {
        switch (state) {
          case State.TOP_LEFT:
            return State.TOP_RIGHT;
          case State.TOP_RIGHT:
            return State.TOP_LEFT;
          case State.BOT_LEFT:
            return State.BOT_RIGHT;
          case State.BOT_RIGHT:
            return State.BOT_LEFT;
          default:
            return state;
        }
      });
    }
  }, [isVertical]);
  // Immediately after render, set speed to slow
  if (isDragging && speed === 0) setSpeed(defaultSpeed);

  React.useEffect(() => {
    let endSubs = [];
    let state = State.TOP;
    let pos = { shortDir: 0, longDir: 0 };

    const getPos = e => {
      if (e.x && e.y) {
        return isVertical
          ? { shortDir: e.x, longDir: e.y }
          : { shortDir: e.y, longDir: e.x };
      }
      return isVertical
        ? {
            shortDir: e.touches[0].clientX,
            longDir: e.touches[0].clientY,
          }
        : {
            shortDir: e.touches[0].clientY,
            longDir: e.touches[0].clientX,
          };
    };

    const hingePos = longSideLen / 2;
    const bounds = [
      [0, shortSideLen / 4],
      [shortSideLen / 4, shortSideLen / 2],
      [shortSideLen / 2, (3 * shortSideLen) / 4],
      [(3 * shortSideLen) / 4, shortSideLen],
    ];

    const onMove = e => {
      if (endSubs.length === 0) return;
      const prvPos = pos;
      pos = getPos(e);
      setPos(pos);

      // If cross down
      if (prvPos.longDir < hingePos && pos.longDir >= hingePos) {
        bounds.forEach((b, i) => {
          if (b[0] <= pos.shortDir && b[1] > pos.shortDir) {
            state = crossDownStates[i];
            setState(state);
          }
        });
      }
      // If cross up
      if (prvPos.longDir >= hingePos && pos.longDir < hingePos) {
        bounds.forEach((b, i) => {
          if (b[0] <= pos.shortDir && b[1] > pos.shortDir) {
            state = crossUpStates[i];
            setState(state);
          }
        });
      }
    };

    const onEnd = e => {
      if (endSubs.length === 0) return;
      endSubs.forEach(sub => sub.unsubscribe());
      endSubs = [];

      if ((e.x && e.y) || e.touches.length === 0) {
        setIsDragging(false);
        // Keep the same state, or revert if nothing changed
        setState(state);
      }
    };

    const onStart = e => {
      if (endSubs.length !== 0) return;
      setIsDragging(true);
      setState(State.FOLLOW);
      pos = getPos(e);
      setPos(pos);

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
  }, [shortSideLen, longSideLen, isVertical]);

  let boxShortLen = shortSideLen / 2;
  switch (state) {
    case State.FOLLOW:
      boxShortLen = 494;
      break;
    case State.TOP:
    case State.BOTTOM:
    case State.FULL:
    case State.HIDDEN:
      boxShortLen = shortSideLen;
      break;
    default:
  }

  let boxLongLen = longSideLen / 2;
  switch (state) {
    case State.FOLLOW:
      boxLongLen = 391;
      break;
    case State.FULL:
    case State.HIDDEN:
      boxLongLen = height;
      break;
    default:
  }

  let shortDir = pos.shortDir - boxShortLen / 2;
  let longDir = pos.longDir - boxLongLen / 2;
  switch (state) {
    case State.FULL:
    case State.HIDDEN:
    case State.TOP:
    case State.TOP_LEFT:
      shortDir = 0;
      longDir = 0;
      break;
    case State.TOP_RIGHT:
      shortDir = shortSideLen / 2;
      longDir = 0;
      break;
    case State.BOTTOM:
    case State.BOT_LEFT:
      shortDir = 0;
      longDir = longSideLen / 2;
      break;
    case State.BOT_RIGHT:
      shortDir = shortSideLen / 2;
      longDir = longSideLen / 2;
      break;
    default:
  }

  let src = null;
  switch (state) {
    case State.TOP:
    case State.BOTTOM:
    case State.FULL:
      if (isVertical) src = HalfWindow;
      else src = HalfHorizWindow;
      break;
    case State.TOP_LEFT:
    case State.TOP_RIGHT:
    case State.BOT_LEFT:
    case State.BOT_RIGHT:
      if (isVertical) src = QuarterWindow;
      else src = QuarterHorizWindow;
      break;
    case State.FOLLOW:
      src = DraggableWindowImg;
      break;
    default:
  }

  return (
    <>
      <Box
        draggable={false}
        src={src}
        ref={ref}
        x={isVertical ? shortDir : longDir}
        y={isVertical ? longDir : shortDir}
        width={isVertical ? boxShortLen : boxLongLen}
        height={isVertical ? boxLongLen : boxShortLen}
        isDragging={isDragging}
        isHidden={state === State.HIDDEN}
        speed={speed}
      />
      <Icon
        src={LeftIcon}
        opacity={
          !isDragging
            ? 0
            : state === State.BOT_LEFT || state === State.TOP_LEFT
            ? 1
            : 0.4
        }
        fraction={0.5 / 4}
        isVertical={isVertical}
        rotate={isVertical ? 0 : 90}
        white
      />
      <Icon
        src={FullIcon}
        opacity={
          !isDragging
            ? 0
            : state === State.TOP || state === State.BOTTOM
            ? 1
            : 0.4
        }
        fraction={1.5 / 4}
        isVertical={isVertical}
        white
      />
      <Icon
        src={CloseIcon}
        opacity={!isDragging ? 0 : state === State.HIDDEN ? 1 : 0.4}
        fraction={2.5 / 4}
        isVertical={isVertical}
        white
      />
      <Icon
        src={RightIcon}
        opacity={
          !isDragging
            ? 0
            : state === State.BOT_RIGHT || state === State.TOP_RIGHT
            ? 1
            : 0.4
        }
        fraction={3.5 / 4}
        isVertical={isVertical}
        rotate={isVertical ? 0 : 90}
        white
      />
    </>
  );
}

export default DraggableWindow;
