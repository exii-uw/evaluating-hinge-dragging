import React from "react";
import BlockRunner from "./BlockRunner";
import X1FoldBlockRunner from "./X1FoldBlockRunner";
import Database, { TaskType } from "../clients/Database";
import usePid from "../hooks/usePid";
import { DragStatus } from "../tasks/DragEvents";
import { blockSequenceFor } from "../tasks/blocks";
import BreakScreen from "./BreakScreen";

const ExperimentRunner = () => {
  const pid = usePid() as number;
  React.useEffect(() => Database.init(pid));

  const [blockIdx, setBlockIdx] = React.useState(-1);
  const blocks = React.useMemo(() => blockSequenceFor(pid), [pid]);

  React.useEffect(() => {
    if (blocks.length === 0) return;
    Database.getBlockIdx(blocks).then((idx) => {
      setBlockIdx(idx);
    });
  }, [pid, blocks]);

  // Notify when we are done
  React.useEffect(() => {
    if (blockIdx >= blocks.length) {
      Database.setStatus({
        status: DragStatus.IDLE,
        type: TaskType.COMPLETE,
      });
      return;
    }
  }, [blockIdx, blocks]);

  if (blockIdx === -1) {
    return <BreakScreen title="Loading" description="Please wait..." />;
  }

  if (blockIdx >= blocks.length) {
    return (
      <BreakScreen
        title="Done"
        description="You have completed the experiment."
      />
    );
  }

  const block = blocks[blockIdx];

  if (block.isX1Fold) {
    return (
      <X1FoldBlockRunner
        key={blockIdx}
        blocks={block.blocks}
        onComplete={() => setBlockIdx((idx) => idx + 1)}
      />
    );
  }

  return (
    <BlockRunner
      key={blockIdx}
      blocks={block.blocks}
      onComplete={() => setBlockIdx((idx) => idx + 1)}
    />
  );
};

export default ExperimentRunner;
