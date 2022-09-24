import React from "react";
import Crosshair from "./Crosshair";
import ColourWheel from "./ColourWheel";
import { Task, insideTargetDist } from "../../tasks/tasks";
import { Block } from "../../tasks/blocks";
import DragController from "../../tasks/DragController";
import { TouchPos, DragStatus } from "../../tasks/DragEvents";
import TouchPoint from "./TouchPoint";
import Screen from "../generic/Screen";
import TargetText from "./TargetText";
import { Transformer } from "../../tasks/CalibrationController";

interface Props {
  block: Block;
  onComplete: () => void;
  transformer: Transformer;
  tasks: Task[];
  circleSize: number;
  cursorHidden?: boolean;
}

const DragScreen = ({
  tasks,
  block,
  onComplete,
  transformer,
  circleSize,
  cursorHidden,
}: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [task, setTask] = React.useState<Task | null>(null);
  const [touchPositions, setTouchPositions] = React.useState<TouchPos[]>([]);
  const [dragStatus, setDragStatus] = React.useState<DragStatus>(
    DragStatus.IDLE
  );

  React.useEffect(() => {
    if (!ref.current) return;
    const controller = new DragController(
      tasks,
      block,
      transformer,
      onComplete
    );
    let task: Task | null = null;

    const success = new Audio("/sfx/success.mp3");
    const error = new Audio("/sfx/error.mp3");
    const done = new Audio("/sfx/done.m4a");

    const subs = [
      controller.task$.subscribe((val) => {
        setTask(val);
        task = val;
      }),
      controller.positions$.subscribe({
        next: (val) => setTouchPositions(val),
      }),
      controller.status$.subscribe((status) => {
        if (status === DragStatus.SUCCESS) {
          if (task && (task.startLabel === "12" || task.startLabel === "L")) {
            done.currentTime = 0;
            done.play();
          } else {
            success.currentTime = 0;
            success.play();
          }
        } else if (status === DragStatus.ERROR) {
          error.currentTime = 0;
          error.play();
        }
        setDragStatus(status);
      }),
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
  }, [transformer, block, onComplete, tasks]);

  return (
    <Screen ref={ref}>
      <ColourWheel
        key="wheel"
        nSegments={12}
        sr={insideTargetDist * 0.8}
        lr={circleSize}
        box={transformer.box}
      />
      {tasks.map((task, idx) => (
        <Crosshair
          key={task.startLabel}
          position={task.startPos}
          label={task.startLabel}
          labelAngle={task.startAngle}
          bold={idx % 3 === 2}
        />
      ))}
      {!cursorHidden &&
        touchPositions.map((t, idx) => (
          <TouchPoint position={t.actualPos} key={idx} />
        ))}
      {!cursorHidden && (
        <TargetText status={dragStatus}>{task ? task.label : "..."}</TargetText>
      )}
    </Screen>
  );
};

export default DragScreen;
