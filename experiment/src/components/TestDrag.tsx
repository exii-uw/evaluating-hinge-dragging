import React from "react";
import DragScreen from "./dragScreen/DragScreen";
import { x1FoldTasks, BoundingBox, outsideTargetDist } from "../tasks/tasks";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { blockSequenceFor } from "../tasks/blocks";

const TestDrag = () => {
  const windowDimensions = useWindowDimensions();
  const boxSize = Math.min(...Object.values(windowDimensions));
  const box: BoundingBox = React.useMemo(
    () => ({
      top: (windowDimensions.height - boxSize) / 2,
      left: (windowDimensions.width - boxSize) / 2,
      height: boxSize,
      width: boxSize,
    }),
    [boxSize, windowDimensions]
  );

  return (
    <DragScreen
      transformer={{
        box,
        transform: (x, y) => [x, y],
      }}
      block={blockSequenceFor(0)[0].blocks[0]}
      tasks={x1FoldTasks(box)}
      onComplete={() => console.log("complete!")}
      circleSize={outsideTargetDist * 0.95}
    />
  );
};

export default TestDrag;
