import React from "react";
import BreakScreen from "./BreakScreen";
import CalibrationScreen from "./calibrationScreen/CalibrationScreen";
import DragScreen from "./dragScreen/DragScreen";
import { Block } from "../tasks/blocks";
import { defaultTasks, outsideTargetDist } from "../tasks/tasks";
import { Transformer } from "../tasks/CalibrationController";
import Database, { TaskType } from "../clients/Database";
import { DragStatus } from "../tasks/DragEvents";

interface Props {
  blocks: Block[];
  onComplete: () => void;
}

const BlockRunner = ({ blocks, onComplete }: Props) => {
  const [status, setStatus] = React.useState(TaskType.PRE_CALIBRATION);
  const [blockIdx, setBlockIdx] = React.useState(0);
  console.log(status, blockIdx);

  const [transformer, setTransformer] = React.useState<Transformer>();
  const tasks = React.useMemo(() => {
    if (blocks.length === 0 || !transformer) return null;
    return defaultTasks(transformer.box);
  }, [transformer, blocks]);

  // Enable control for the next block
  React.useEffect(() => {
    const unsub = Database.subscribeStart(() => {
      Database.confirmStart();
      setStatus((status) => {
        if (status === TaskType.PRE_BLOCK) return TaskType.BLOCK;
        if (status === TaskType.PRE_CALIBRATION) return TaskType.CALIBRATION;
        return status;
      });
    });

    return () => unsub();
  }, []);

  const block = blocks[blockIdx];

  React.useEffect(() => {
    if (status === TaskType.PRE_BLOCK || status === TaskType.PRE_CALIBRATION) {
      Database.setStatus({
        block,
        status: DragStatus.IDLE,
        type: status,
      });
    }
  }, [block, status]);

  if (status === TaskType.PRE_CALIBRATION) {
    return (
      <BreakScreen
        title={`Calibration: ${block.title}`}
        description={block.description}
        onClick={() => setStatus(TaskType.CALIBRATION)}
      />
    );
  }

  if (status === TaskType.CALIBRATION) {
    return (
      <CalibrationScreen
        block={block}
        onComplete={(t) => {
          setTransformer(t);
          setStatus(TaskType.PRE_BLOCK);
        }}
      />
    );
  }

  if (status === TaskType.BLOCK && transformer && tasks) {
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
        circleSize={outsideTargetDist * 1.25}
      />
    );
  }

  return <BreakScreen {...block} onClick={() => setStatus(TaskType.BLOCK)} />;
};

export default BlockRunner;
