import React from "react";
import TouchPoint from "../dragScreen/TouchPoint";
import Database from "../../clients/Database";
import usePid from "../../hooks/usePid";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import CalibrationController, {
  Transformer,
} from "../../tasks/CalibrationController";
import {
  BoundingBox,
  calibrationTasks,
  CalibrationTask,
  Position,
} from "../../tasks/tasks";
import { Block } from "../../tasks/blocks";
import Screen from "../generic/Screen";
import CalibrationTarget from "./CalibrationTarget";
import { DragStatus } from "../../tasks/DragEvents";

interface Props {
  block: Block;
  onComplete: (t: Transformer) => void;
}

const CalibrationScreen = ({ block, onComplete }: Props) => {
  const pid = usePid();
  const ref = React.useRef<HTMLDivElement>(null);
  const [task, setTask] = React.useState<CalibrationTask | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [transformer, setTransformer] = React.useState<Transformer>();
  const windowDimensions = useWindowDimensions();
  const [positions, setPositions] = React.useState<Position[]>([]);
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
  const tasks = React.useMemo(() => calibrationTasks(box), [box]);

  // @TODO: remove this initialization when used within the experiment
  React.useEffect(() => {
    if (!pid) return;
    Database.init(pid);
  }, [pid]);

  React.useEffect(() => {
    if (!ref.current) return;
    const controller = new CalibrationController(tasks, box, block, (t) =>
      setTransformer(t)
    );

    const success = new Audio("/sfx/success.mp3");
    const error = new Audio("/sfx/error.mp3");

    const subs = [
      controller.task$.subscribe((task) => setTask(task)),
      controller.progress$.subscribe((p) => setProgress(p)),
      controller.status$.subscribe((status) => {
        if (status === DragStatus.SUCCESS) {
          success.currentTime = 0;
          success.play();
        } else if (status === DragStatus.ERROR) {
          error.currentTime = 0;
          error.play();
        }
      }),
      controller.positions$.subscribe((p) => setPositions([...p])),
    ];

    const onStart = (e: TouchEvent) => {
      e.preventDefault();
      controller.touchStart(e);
    };

    const onStartMouse = (e: MouseEvent) => {
      e.preventDefault();
      controller.mouseStart(e);
    };

    const onMove = (e: TouchEvent) => {
      e.preventDefault();
      controller.touchMove(e);
    };

    const onMoveMouse = (e: MouseEvent) => {
      e.preventDefault();
      controller.mouseMove(e);
    };

    const onEnd = (e: TouchEvent) => {
      e.preventDefault();
      controller.touchEnd(e);
    };

    const onEndMouse = (e: MouseEvent) => {
      e.preventDefault();
      controller.mouseEnd(e);
    };

    const onKeyPress = (e: KeyboardEvent) => {
      const zKey = 90;
      if (e.ctrlKey && e.which === zKey) controller.undo();
    };

    const el = ref.current;
    el.addEventListener("touchstart", onStart);
    el.addEventListener("mousedown", onStartMouse);
    el.addEventListener("touchmove", onMove);
    el.addEventListener("mousemove", onMoveMouse);
    el.addEventListener("touchend", onEnd);
    el.addEventListener("mouseup", onEndMouse);
    document.addEventListener("keyup", onKeyPress);

    return () => {
      controller.cleanup();
      subs.forEach((s) => s.unsubscribe());
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("mousedown", onStartMouse);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("mousemove", onMoveMouse);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("mouseup", onEndMouse);
      document.removeEventListener("keyup", onKeyPress);
    };
  }, [box, tasks, block, onComplete]);

  // Press enter to confirm the last one
  React.useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      const enterKey = 13;
      if (e.which === enterKey && transformer) onComplete(transformer);
    };
    document.addEventListener("keyup", onKeyPress);

    return () => document.removeEventListener("keyup", onKeyPress);
  }, [onComplete, transformer]);

  return (
    <Screen ref={ref}>
      {task && <CalibrationTarget position={task.pos} completion={progress} />}
      {positions.map((pos) => (
        <TouchPoint position={pos} key={`${pos.x}-${pos.y}`} />
      ))}
    </Screen>
  );
};

export default CalibrationScreen;
