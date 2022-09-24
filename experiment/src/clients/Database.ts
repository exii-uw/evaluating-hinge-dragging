import { initializeApp } from "firebase/app";
import { DragStatus, NormalizedEvent } from "../tasks/DragEvents";
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  arrayUnion,
  Timestamp,
} from "@firebase/firestore";
import { BoundingBox, Position } from "../tasks/tasks";
import { Block, BlockSequence } from "../tasks/blocks";

const firebaseConfig = {
  apiKey: "AIzaSyCK_3F_lsstJKGoW_UZdXvpJldKFUS2QPU",
  authDomain: "curved-display.firebaseapp.com",
  projectId: "curved-display",
  storageBucket: "curved-display.appspot.com",
  messagingSenderId: "360602692951",
  appId: "1:360602692951:web:156f38106649796bcea212",
};

const version = "v1";

interface Drag {
  blockID: string;
  idx: number;
  touchIds: number[]; // or -1 if it failed
  success: boolean;
  events: NormalizedEvent[];
}

interface Calibration {
  configuration: string;
  // No 2D arrays in Firebase
  pointTouches: Record<string, NormalizedEvent[]>;
  box: BoundingBox;
  srcPoints: Position[];
  destPoints: Position[];
}

interface Participant {
  completed: string;
}

export enum TaskType {
  LOADING = "LOADING",
  PRE_BLOCK = "PRE_BLOCK",
  BLOCK = "BLOCK",
  PRE_CALIBRATION = "PRE_CALIBRATION",
  CALIBRATION = "CALIBRATION",
  COMPLETE = "COMPLETE",
}

interface AppStatus {
  block: Block;
  target?: string;
  taskIdx?: number;
  status: DragStatus;
  type: TaskType;
}

class Database {
  private static db?: Firestore;
  private static pid?: number;

  public static init(pid: number) {
    if (this.db === undefined)
      this.db = getFirestore(initializeApp(firebaseConfig));
    this.pid = pid;
  }

  private static getDb(): Firestore {
    if (this.db) return this.db;
    throw new Error("Database connection was not initialized");
  }

  public static async calibrate(calibration: Calibration) {
    const calibrationRef = doc(
      this.getDb(),
      version,
      `${this.pid}`,
      "calibration",
      calibration.configuration
    );
    await setDoc(calibrationRef, {
      ...calibration,
      time: Timestamp.now(),
      type: "calibration",
    });
  }

  public static finishConf(confID: string) {
    const participantRef = doc(this.getDb(), version, `${this.pid}`);
    return setDoc(
      participantRef,
      { completed: arrayUnion(confID) },
      { merge: true }
    );
  }

  public static logDrag(drag: Drag) {
    console.log(drag);
    const taskRef = doc(
      this.getDb(),
      version,
      `${this.pid}`,
      "block",
      drag.blockID,
      "task",
      `${drag.idx}`
    );
    return setDoc(
      taskRef,
      {
        attempts: arrayUnion(drag),
        type: "drag",
        time: Timestamp.now(),
        success: drag.success,
      },
      { merge: true }
    );
  }

  public static async getBlockIdx(blocks: BlockSequence[]) {
    if (this.pid === undefined)
      throw new Error("Participant ID was not set in the database client");
    // We need to start from the beginning of using this configuration,
    // regardless of the block ID, for calibration purposes
    const participantRef = doc(this.getDb(), version, `${this.pid}`);
    const snapshot = await getDoc(participantRef);
    const data = snapshot.data();
    if (data === undefined) return 0;

    const completed = new Set((data as Participant).completed);
    let blockIdx = 0;
    while (completed.has(blocks[blockIdx].configuration)) blockIdx++;

    return blockIdx;
  }

  public static async setStatus(status: Partial<AppStatus>) {
    const participantRef = doc(this.getDb(), version, `${this.pid}`);
    await setDoc(participantRef, status, { merge: true });
  }

  public static confirmStart() {
    const actionsRef = doc(this.getDb(), "actions", `${this.pid}`);
    return setDoc(actionsRef, { ready: false });
  }

  public static subscribeStart(cb: () => void) {
    const actionsRef = doc(this.getDb(), "actions", `${this.pid}`);
    return onSnapshot(actionsRef, (doc) => {
      const data = doc.data();
      if (data !== undefined && data.ready) cb();
    });
  }
}

export default Database;
