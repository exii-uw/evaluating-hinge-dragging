import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  interval,
} from "rxjs";
import { map, take } from "rxjs/operators";
import Database, { TaskType } from "../clients/Database";
import {
  DragStatus,
  getNormalizedMouseEvent,
  getNormalizedTouchEvent,
  NormalizedEvent,
} from "./DragEvents";
import { Block } from "./blocks";
import { BoundingBox, CalibrationTask, Position } from "./tasks";
import { Transform } from "./transform/Transform";
import createTransform from "./transform/affine25";

const refreshMs = 50;
const minimumHold = 400;

export interface Transformer {
  transform: Transform;
  box: BoundingBox;
}

const getPos = (touches: NormalizedEvent[]): Position => {
  // Get the touch id with longest duration
  const idDurations: Record<string, number> = {};
  touches.forEach((event) => {
    Object.keys(event.positions).forEach((key) => {
      if (idDurations[key]) idDurations[key]++;
      else idDurations[key] = 1;
    });
  });
  const [touchId] = Object.entries(idDurations).reduce(
    ([id, dur], [nxtId, nxtDur]) => {
      if (nxtDur > dur) return [nxtId, nxtDur];
      return [id, dur];
    },
    ["-1", 0]
  );

  const sumPos = touches.reduce(
    ({ x, y, n }, event) => {
      const pos = event.positions[touchId];
      if (pos) return { x: pos.rawPos.x + x, y: pos.rawPos.y + y, n: n + 1 };
      return { x, y, n };
    },
    { x: 0, y: 0, n: 0 }
  );
  return { x: sumPos.x / sumPos.n, y: sumPos.y / sumPos.n };
};

class CalibrationController {
  private _taskIdx$ = new BehaviorSubject<number>(0);
  public task$: Observable<CalibrationTask | null>;
  private _progress$ = new BehaviorSubject<number>(0);
  public progress$: Observable<number> = this._progress$;
  private _status$ = new BehaviorSubject<DragStatus>(DragStatus.IDLE);
  public status$: Observable<DragStatus> = this._status$;
  private subscription?: Subscription;
  private statusSub: Subscription;

  private tasks: CalibrationTask[];
  private transformer: Transformer;
  private block: Block;
  private onComplete: (t: Transformer) => void;

  private touches: NormalizedEvent[][];
  public srcPoints: Position[] = [];
  public _positions$ = new Subject<Position[]>();
  public positions$: Observable<Position[]> = this._positions$;

  constructor(
    tasks: CalibrationTask[],
    box: BoundingBox,
    block: Block,
    onComplete: (t: Transformer) => void
  ) {
    this.tasks = tasks;
    this.touches = new Array(tasks.length).fill(0).map((_) => []);
    this.task$ = this._taskIdx$.pipe(
      map((idx) => (idx === -1 ? null : tasks[idx]))
    );
    // Transform is constant
    this.transformer = {
      transform: (x, y) => [x, y],
      box,
    };
    this.block = block;
    this.onComplete = onComplete;

    this.statusSub = this._status$.subscribe((status) => {
      const taskIdx = this._taskIdx$.getValue();
      Database.setStatus({
        block: this.block,
        target:
          taskIdx === -1 || taskIdx >= tasks.length
            ? "..."
            : tasks[taskIdx].label,
        taskIdx: taskIdx,
        status,
        type: TaskType.CALIBRATION,
      });
    });
  }

  public cleanup() {
    this.subscription?.unsubscribe();
    this.statusSub.unsubscribe();
  }

  public undo() {
    const taskIdx = this._taskIdx$.getValue();
    if (taskIdx <= 0) return;
    this._taskIdx$.next(taskIdx - 1);
    this.srcPoints.pop();
    this._positions$.next(this.srcPoints);

    // Reset
    this._status$.next(DragStatus.IDLE);
  }

  public mouseStart(mouse: MouseEvent) {
    const taskIdx = this._taskIdx$.getValue();
    if (taskIdx === -1 || taskIdx >= this.tasks.length) return;
    this._status$.next(DragStatus.DRAGGING);
    const loggedEvent = getNormalizedMouseEvent(mouse, this.transformer);
    this.touches[taskIdx] = [loggedEvent];

    this.subscription = interval(refreshMs)
      .pipe(take(minimumHold / refreshMs))
      .subscribe((idx) => {
        this._progress$.next(((idx + 1) * refreshMs) / minimumHold);
        if (this._progress$.getValue() === 1)
          this._status$.next(DragStatus.SUCCESS);
      });
  }

  public mouseMove(mouse: MouseEvent) {
    const taskIdx = this._taskIdx$.getValue();
    if (taskIdx === -1 || taskIdx >= this.tasks.length) return;
    const loggedEvent = getNormalizedMouseEvent(mouse, this.transformer);
    this.touches[taskIdx].push(loggedEvent);
  }

  public mouseEnd(mouse: MouseEvent) {
    this.subscription?.unsubscribe();
    const taskIdx = this._taskIdx$.getValue();
    const accidental = this._progress$.getValue() < 1;
    this._progress$.next(0);
    if (taskIdx === -1 || taskIdx >= this.tasks.length) return;
    if (accidental) {
      this._status$.next(DragStatus.ERROR);
      return;
    }

    const loggedEvent = getNormalizedMouseEvent(mouse, this.transformer);
    this.touches[taskIdx].push(loggedEvent);

    // Log the calibration if we finished the last touch
    const pos = getPos(this.touches[taskIdx]);
    this.srcPoints.push(pos);
    this._positions$.next(this.srcPoints);
    if (taskIdx + 1 === this.tasks.length) {
      this.finishCalibration();
    } else {
      this._taskIdx$.next(taskIdx + 1);
    }

    this._status$.next(DragStatus.IDLE);
  }

  public touchStart(touch: TouchEvent) {
    const taskIdx = this._taskIdx$.getValue();
    if (taskIdx === -1 || taskIdx >= this.tasks.length) return;
    this._status$.next(DragStatus.DRAGGING);

    const loggedEvent = getNormalizedTouchEvent(touch, this.transformer);

    // If we already started, add the event but don't restart timer
    if (touch.touches.length > 1) {
      this.touches[taskIdx].push(loggedEvent);
      return;
    }
    this.touches[taskIdx] = [loggedEvent];

    this.subscription = interval(refreshMs)
      .pipe(take(minimumHold / refreshMs))
      .subscribe((idx) => {
        const progress = ((idx + 1) * refreshMs) / minimumHold;
        if (progress >= 1) this._status$.next(DragStatus.SUCCESS);
        this._progress$.next(progress);
      });
  }

  public touchMove(touch: TouchEvent) {
    const taskIdx = this._taskIdx$.getValue();
    if (taskIdx === -1 || taskIdx >= this.tasks.length) return;
    const loggedEvent = getNormalizedTouchEvent(touch, this.transformer);
    this.touches[taskIdx].push(loggedEvent);
  }

  private finishCalibration() {
    // For each source point, get the touch position for the longest touch
    const srcPoints = this.srcPoints;
    const destPoints = this.tasks.map((task) => task.pos);

    Database.calibrate({
      configuration: this.block.configuration,
      // Turn 2D array into a map (required for Firebase support)
      pointTouches: this.touches.reduce(
        (acc, ts, idx) => ({ ...acc, [`${idx}`]: ts }),
        {}
      ),
      box: this.transformer.box,
      srcPoints,
      destPoints,
    });

    // Keep going up
    this._taskIdx$.next(this._taskIdx$.getValue() + 1);
    const transform = createTransform(srcPoints, destPoints);
    this.onComplete({ transform, box: this.transformer.box });
  }

  public touchEnd(touch: TouchEvent) {
    const taskIdx = this._taskIdx$.getValue();
    if (taskIdx === -1 || taskIdx >= this.tasks.length) return;

    const loggedEvent = getNormalizedTouchEvent(touch, this.transformer);
    this.touches[taskIdx].push(loggedEvent);

    // Only finish if we have 0 touches
    if (touch.touches.length > 0) return;

    this.subscription?.unsubscribe();
    const accidental = this._progress$.getValue() < 1;
    this._progress$.next(0);
    if (accidental) {
      this._status$.next(DragStatus.IDLE);
      return;
    }

    // Log the calibration if we finished the last touch
    const pos = getPos(this.touches[taskIdx]);
    this.srcPoints.push(pos);
    this._positions$.next(this.srcPoints);
    if (taskIdx + 1 === this.tasks.length) {
      this.finishCalibration();
    } else {
      this._taskIdx$.next(taskIdx + 1);
    }

    this._status$.next(DragStatus.IDLE);
  }
}

export default CalibrationController;
