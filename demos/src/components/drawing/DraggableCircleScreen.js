import React from "react";
import styled from "@emotion/styled";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import DraggableCircle from "./DraggableCircle";
import Icon from "../util/Icon";
import BlueIcon from "./icons/blue.svg";
import RedIcon from "./icons/red.svg";
import GreenIcon from "./icons/green.svg";
import CircleClose from "./icons/circle-close.svg";
import CirclePlus from "./icons/circle-plus.svg";
import Screen from "../util/Screen";

const icons = [
  { icon: CirclePlus, fraction: 1 / 8 },
  { icon: BlueIcon, fraction: 1 / 3 },
  { icon: RedIcon, fraction: 1 / 2 },
  { icon: GreenIcon, fraction: 2 / 3 },
  { icon: CircleClose, fraction: 7 / 8 },
];

const colours = {
  BLUE: "#5289ff",
  RED: "#ff5269",
  GREEN: "#71ff52",
};
let i = 2;
const size = 300;

function DraggableCircleScreen() {
  const [nDragging, setNDragging] = React.useState(0);
  const [positions, setPositions] = React.useState({
    0: {
      origX: size,
      origY: size,
      x: size,
      y: size,
      size: size,
      colour: colours.BLUE,
      visible: true,
    },
    1: {
      origX: size,
      origY: 1000,
      x: size,
      y: 1000,
      size: size / 2,
      colour: colours.RED,
      visible: true,
    },
  });
  const { width, height } = useWindowDimensions();
  const isVertical = width < height;

  const bounds = React.useMemo(
    () => [
      {
        start: 0,
        end: 1 / 4,
        onCross: index => {
          setPositions(p => ({
            ...p,
            [i++]: {
              ...p[index],
              x: p[index].origX,
              y: p[index].origY,
            },
          }));
        },
      },
      {
        start: 1 / 4,
        end: 5 / 12,
        onCross: index => {
          setPositions(p => ({
            ...p,
            [index]: { ...p[index], colour: colours.BLUE },
          }));
        },
      },
      {
        start: 5 / 12,
        end: 7 / 12,
        onCross: index => {
          setPositions(p => ({
            ...p,
            [index]: { ...p[index], colour: colours.RED },
          }));
        },
      },
      {
        start: 7 / 12,
        end: 3 / 4,
        onCross: index => {
          setPositions(p => ({
            ...p,
            [index]: { ...p[index], colour: colours.GREEN },
          }));
        },
      },
      {
        start: 3 / 4,
        end: 1,
        onCross: index => {
          setPositions(p => {
            let newP = { ...p };
            delete newP[index];
            return newP;
          });
        },
      },
    ],
    [setPositions]
  );

  const onStart = React.useCallback(index => {
    setNDragging(n => n + 1);
  }, []);

  const onDrag = React.useCallback(
    (pos, crossed, index) => {
      if (crossed) {
        bounds.forEach(bound => {
          if (bound.start <= crossed && bound.end > crossed) {
            bound.onCross(index);
          }
        });
      }
      setPositions(p => ({
        ...p,
        [index]: {
          ...p[index],
          ...pos,
        },
      }));
    },
    [bounds]
  );

  const onEnd = React.useCallback(index => {
    setNDragging(n => n - 1);
    setPositions(p => ({
      ...p,
      [index]: {
        ...p[index],
        origX: p[index].x,
        origY: p[index].y,
      },
    }));
  }, []);

  return (
    <Screen>
      {Object.entries(positions).map(([id, pos]) => (
        <DraggableCircle
          key={id}
          id={id}
          {...pos}
          onStartDrag={onStart}
          onDrag={onDrag}
          onEndDrag={onEnd}
        />
      ))}
      {icons.map((ico, i) => (
        <Icon
          key={i}
          src={ico.icon}
          opacity={nDragging === 0 ? 0 : 1}
          fraction={ico.fraction}
          isVertical={isVertical}
        />
      ))}
    </Screen>
  );
}

export default DraggableCircleScreen;
