import React from "react";
import { useNavigate } from "react-router-dom";
import Database, { AppStatus, TaskType } from "../clients/Database";
import usePid from "../hooks/usePid";
import BreakScreen from "./BreakScreen";
import TaskScreen from "./TaskScreen";

const ExperimentRunner = () => {
  const nav = useNavigate();
  const pid = usePid();
  const [status, setStatus] = React.useState<AppStatus>();

  React.useEffect(() => {
    if (pid === undefined) {
      nav("/");
      return;
    }

    Database.init(pid);
    const unsub = Database.subscribeStatus((s) => setStatus(s));
    return () => unsub();
  }, [nav, pid]);

  if (status === undefined || status.type === TaskType.LOADING) {
    return <BreakScreen title="Loading..." />;
  }

  if (status.type === TaskType.PRE_CALIBRATION) {
    return (
      <BreakScreen
        title={`Calibration: ${status.block.condition}`}
        description={
          status.block.disableNext
            ? `Ask the facilitator to set up the next prototype. Then, calibrate the display using ${status.block.condition} input.`
            : `Click 'next' to calibrate the display using ${status.block.condition} input. If you make a mistake, ask your facilitator for help.`
        }
        onClick={status.block.disableNext ? undefined : () => Database.start()}
      />
    );
  }

  if (status.type === TaskType.PRE_BLOCK) {
    return (
      <BreakScreen
        title={status.block.title}
        description={
          status.block.disableNext
            ? "Ask the facilitator to start the next block."
            : status.block.description
        }
        onClick={status.block.disableNext ? undefined : () => Database.start()}
      />
    );
  }

  if (
    status.target &&
    (status.type === TaskType.CALIBRATION || status.type === TaskType.BLOCK)
  ) {
    return <TaskScreen target={status.target} status={status.status} />;
  }

  if (status.type === TaskType.COMPLETE) {
    return <BreakScreen title="You've completed the experiment!" />;
  }

  return <BreakScreen title="Loading..." />;
};

export default ExperimentRunner;
