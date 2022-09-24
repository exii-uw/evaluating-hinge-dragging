import { BehaviorSubject, Observable, timer, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import Database, { TaskType } from "../clients/Database";
import { Position, Task } from "./tasks";
import { Block } from "./blocks";
import {
  TouchPos,
  NormalizedEvent,
  getNormalizedTouchEvent,
  getNormalizedMouseEvent,
  DragStatus,
} from "./DragEvents";
import { Transformer } from "./CalibrationController";

enum InputType {
  TOUCH = "TOUCH",
  MOUSE = "MOUSE",
  NONE = "NONE",
}

const getDist = (pos1: Position, pos2: Position) => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Allowable distance between a touch and the target
const maxNormDist = 0.15;

class DragController {
  private _taskIdx$ = new BehaviorSubject<number>(0);
  public task$: Observable<Task | null>;
  private _positions$ = new BehaviorSubject<TouchPos[]>([]);
  public positions$: Observable<TouchPos[]> = this._positions$;
  private _status$ = new BehaviorSubject<DragStatus>(DragStatus.IDLE);
  public status$: Observable<DragStatus> = this._status$;
  private inputType: InputType = InputType.NONE;
  private onComplete: () => void;
  private statusSub: Subscription;

  private transformer: Transformer;
  private block: Block;
  private tasks: Task[];
  private touches: NormalizedEvent[] = [];

  constructor(
    tasks: Task[],
    block: Block,
    transformer: Transformer,
    onComplete: () => void
  ) {
    this.task$ = this._taskIdx$.pipe(
      map((idx) => (idx === -1 ? null : tasks[idx]))
    );
    this.tasks = tasks;
    this.block = block;
    this.transformer = transformer;
    this.onComplete = onComplete;

    this.statusSub = this.status$.subscribe((status) => {
      const idx = this._taskIdx$.getValue();
      Database.setStatus({
        block: this.block,
        target: idx === -1 ? "..." : tasks[idx].label,
        taskIdx: idx,
        status,
        type: TaskType.BLOCK,
      });
    });
  }

  public cleanup() {
    this.statusSub.unsubscribe();
  }

  public undo() {
    const taskIdx = this._taskIdx$.getValue();
    if (taskIdx <= 0) return;
    this._taskIdx$.next(taskIdx - 1);

    // Reset
    this._status$.next(DragStatus.IDLE);
  }

  public mouseStart(mouse: MouseEvent) {
    if (this._taskIdx$.getValue() === -1) return;
    if (this.inputType === InputType.TOUCH) return;
    this.inputType = InputType.MOUSE;
    this._status$.next(DragStatus.DRAGGING);

    const loggedEvent = getNormalizedMouseEvent(mouse, this.transformer);
    this._positions$.next(Object.values(loggedEvent.positions));

    // If we want to pick up after a pause, should use logic similar to the touchStart
    // where we check if dragging first. However, this also means we need to not send a
    // IDLE event when mouseEnd happens.
    this.touches = [loggedEvent];
  }

  public mouseMove(mouse: MouseEvent) {
    if (this._taskIdx$.getValue() === -1) return;
    // Mouse move events occur even when not pressed
    if (this._status$.getValue() !== DragStatus.DRAGGING) return;
    if (this.inputType !== InputType.MOUSE) return;

    const loggedEvent = getNormalizedMouseEvent(mouse, this.transformer);
    this._positions$.next(Object.values(loggedEvent.positions));
    this.touches.push(loggedEvent);
  }

  public mouseEnd(mouse: MouseEvent) {
    const taskIdx = this._taskIdx$.getValue();
    if (taskIdx === -1) return;
    if (this.inputType !== InputType.MOUSE) return;

    this._status$.next(DragStatus.IDLE);
    const loggedEvent = getNormalizedMouseEvent(mouse, this.transformer);
    this._positions$.next([]);
    this.touches.push(loggedEvent);

    this.nextTask();
  }

  public touchStart(touch: TouchEvent) {
    if (this._taskIdx$.getValue() === -1) return;
    if (this.inputType === InputType.MOUSE) return;
    this.inputType = InputType.TOUCH;

    const wasDragging = this._status$.getValue() === DragStatus.DRAGGING;
    this._status$.next(DragStatus.DRAGGING);

    const loggedEvent = getNormalizedTouchEvent(touch, this.transformer);
    this._positions$.next(Object.values(loggedEvent.positions));

    if (wasDragging) this.touches.push(loggedEvent);
    else this.touches = [loggedEvent];
  }

  public touchMove(touch: TouchEvent) {
    if (this._taskIdx$.getValue() === -1) return;
    if (this.inputType !== InputType.TOUCH) return;

    const loggedEvent = getNormalizedTouchEvent(touch, this.transformer);
    this._positions$.next(Object.values(loggedEvent.positions));
    this.touches.push(loggedEvent);
  }

  private bestDragIds(): [number, number] {
    // Until commit 5a72e75854e67ba7ab578e0907d51a401839394d
    // this would get best drag, allowing a gap between start/end.
    // Now, we just look for the best continuous drag.
    const taskIdx = this._taskIdx$.getValue();

    // Get a list of all touch IDs
    const startCosts: Record<string, number> = {};
    this.touches.forEach((event) => {
      Object.entries(event.positions).forEach(([id, { normPos }]) => {
        if (!startCosts[id])
          startCosts[id] = getDist(normPos, this.tasks[taskIdx].startPosNorm);
      });
    });
    const endCosts: Record<string, number> = {};
    this.touches
      .slice()
      .reverse()
      .forEach((event) => {
        Object.entries(event.positions).forEach(([id, { normPos }]) => {
          if (!endCosts[id])
            endCosts[id] = getDist(normPos, this.tasks[taskIdx].endPosNorm);
        });
      });

    // Get the lowest cost
    let bestCost = Number.MAX_VALUE;
    let bestTouchId = "-1";
    Object.keys(startCosts).forEach((touchId) => {
      if (endCosts[touchId]) {
        const cost = startCosts[touchId] + endCosts[touchId];
        if (
          startCosts[touchId] < maxNormDist &&
          endCosts[touchId] < maxNormDist &&
          cost < bestCost
        ) {
          bestCost = cost;
          bestTouchId = touchId;
        }
      }
    });

    return [parseInt(bestTouchId), parseInt(bestTouchId)];
  }

  public touchEnd(touch: TouchEvent) {
    const taskIdx = this._taskIdx$.getValue();
    if (taskIdx === -1) return;
    if (this.inputType !== InputType.TOUCH) return;

    const loggedEvent = getNormalizedTouchEvent(touch, this.transformer);
    this.touches.push(loggedEvent);
    this._positions$.next(Object.values(loggedEvent.positions));

    // Only finish if we have 0 touches
    if (touch.touches.length > 0) return;

    this.nextTask();
  }

  // Goes to the next task (not called for some delay in touch condition
  private nextTask() {
    const touchIds = this.bestDragIds();
    const success = touchIds[0] !== -1 && touchIds[1] !== -1;
    const taskIdx = this._taskIdx$.getValue();
    if (taskIdx === -1) return;
    this.inputType = InputType.NONE;

    // Set the status of the dragging based on the result
    this._status$.next(success ? DragStatus.SUCCESS : DragStatus.ERROR);
    timer(500).subscribe(() => {
      if (
        this._status$.getValue() === DragStatus.SUCCESS ||
        this._status$.getValue() === DragStatus.ERROR
      ) {
        this._status$.next(DragStatus.IDLE);
      }
    });

    Database.logDrag({
      blockID: this.block.id,
      idx: taskIdx,
      touchIds,
      events: this.touches,
      success,
    });

    if (success) {
      if (taskIdx + 1 === this.tasks.length) {
        this.onComplete();
        this._taskIdx$.next(-1);
      } else {
        this._taskIdx$.next(taskIdx + 1);
      }
    }
  }
}

export default DragController;
