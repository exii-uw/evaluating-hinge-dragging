import React from "react";
import BreakScreen from "./BreakScreen";
import DragScreen from "./dragScreen/DragScreen";
import { Block } from "../tasks/blocks";
import { outsideTargetDist, BoundingBox, x1FoldTasks } from "../tasks/tasks";
import { Transformer } from "../tasks/CalibrationController";
import Database, { TaskType } from "../clients/Database";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { DragStatus } from "../tasks/DragEvents";

interface Props {
  blocks: Block[];
  onComplete: () => void;
}

const X1FoldBlockRunner = ({ blocks, onComplete }: Props) => {
  console.log(blocks);
  const [status, setStatus] = React.useState(TaskType.PRE_BLOCK);
  const [blockIdx, setBlockIdx] = React.useState(0);

  // We specify the transformer manually rather than using calibration
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
  // By default, the transform is just a basic transform
  const transformer = React.useMemo<Transformer>(
    () => ({
      box,
      transform: (x, y) => [x, y],
    }),
    [box]
  );

  const tasks = React.useMemo(() => x1FoldTasks(box), [box]);

  React.useEffect(() => {
    const unsub = Database.subscribeStart(() => {
      Database.confirmStart();
      setStatus((status) => {
        if (status === TaskType.PRE_BLOCK) return TaskType.BLOCK;
        return status;
      });
    });

    return () => unsub();
  }, []);

  const block = blocks[blockIdx];

  React.useEffect(() => {
    if (status === TaskType.PRE_BLOCK) {
      Database.setStatus({
        block,
        status: DragStatus.IDLE,
        type: status,
      });
    }
  }, [block, status]);

  if (status === TaskType.BLOCK) {
    return (
      <DragScreen
        transformer={transformer}
        tasks={tasks}
        block={block}
        onComplete={() => {
          if (blockIdx + 1 === blocks.length) {
            Database.finishConf(block.configuration);
            onComplete();
          } else {
            setStatus(TaskType.PRE_BLOCK);
            setBlockIdx((id) => id + 1);
          }
        }}
        circleSize={outsideTargetDist * 0.95}
        cursorHidden
      />
    );
  }

  return <BreakScreen {...block} onClick={() => setStatus(TaskType.BLOCK)} />;
};

export default X1FoldBlockRunner;
