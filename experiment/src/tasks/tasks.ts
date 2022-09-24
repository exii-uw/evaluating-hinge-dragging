const outsideTargetLabels = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];
export const outsideTargetDist = 0.4;
const insideTargetLabels = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
];
export const insideTargetDist = 0.2;

export interface BoundingBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

/**
 * Gets a position in a bounding box using polar coordinates,
 * anchored at the center of the bounding box.
 *
 * @param angle - angle, in radians
 * @param dist - distance from the reference point to the desired position,
 * relative to the box size (0.5 indicates it is at the edge of the box)
 * @param box - the reference box
 */
const getPos = (angle: number, dist: number, box: BoundingBox): Position => {
  const centerX = box.left + 0.5 * box.width;
  const centerY = box.top + 0.5 * box.height;

  return {
    x: centerX + Math.cos(angle) * dist * box.width,
    y: centerY - Math.sin(angle) * dist * box.height,
  };
};

const getPosNorm = (angle: number, dist: number): Position => {
  return getPos(angle, dist, { top: 0, left: 0, width: 1, height: 1 });
};

export interface Task {
  label: string;
  startLabel: string;
  startAngle: number;
  endLabel: string;
  startPos: Position;
  startPosNorm: Position;
  endPos: Position;
  endPosNorm: Position;
}

export interface CalibrationTask {
  label: string;
  pos: Position;
  posNorm: Position;
}

const getTasks = (box: BoundingBox, dist: number, labels: string[]): Task[] => {
  const n = labels.length;
  const getAngle = (idx: number) =>
    Math.PI / 2 - (idx + 1) * ((2 * Math.PI) / n);

  return labels.map((startLabel, idx) => {
    const endIdx = (idx + n / 2) % n;
    const endLabel = labels[endIdx];
    const startAngle = getAngle(idx);
    const endAngle = getAngle(endIdx);

    return {
      startLabel,
      endLabel,
      label: `${startLabel}-${endLabel}`,
      startPos: getPos(startAngle, dist, box),
      startPosNorm: getPosNorm(startAngle, dist),
      startAngle,
      endPos: getPos(endAngle, dist, box),
      endPosNorm: getPosNorm(endAngle, dist),
    };
  });
};

// Calibration entails touching the origin (0) and every target on the outer ring and inner ring
export const calibrationTasks = (box: BoundingBox): CalibrationTask[] => {
  const outsideTasks = getTasks(box, outsideTargetDist, outsideTargetLabels);
  const insideTasks = getTasks(box, insideTargetDist, insideTargetLabels);
  const tasks: CalibrationTask[] = [...outsideTasks, ...insideTasks].map(
    (task) => ({
      label: task.startLabel,
      pos: task.startPos,
      posNorm: task.startPosNorm,
    })
  );

  tasks.push({
    label: "0",
    pos: getPos(0, 0, box),
    posNorm: getPosNorm(0, 0),
  });

  return tasks;
};

export const defaultTasks = (box: BoundingBox): Task[] => {
  const outsideTasks = getTasks(box, outsideTargetDist, outsideTargetLabels);
  const insideTasks = getTasks(box, insideTargetDist, insideTargetLabels);
  return [...outsideTasks, ...insideTasks];
};

export const x1FoldTasks = (box: BoundingBox): Task[] => {
  // X1 fold width: 20.269cm, height: 27.026cm
  // REAL WORLD: inner circle radius is 5.68.
  const dist = 5.68 / 20.269;
  return getTasks(box, dist, insideTargetLabels);
};
