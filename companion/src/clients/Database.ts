import { initializeApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  onSnapshot,
} from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCK_3F_lsstJKGoW_UZdXvpJldKFUS2QPU",
  authDomain: "curved-display.firebaseapp.com",
  projectId: "curved-display",
  storageBucket: "curved-display.appspot.com",
  messagingSenderId: "360602692951",
  appId: "1:360602692951:web:156f38106649796bcea212",
};

const version = "v1";

interface Block {
  index: number;
  id: string;
  disableNext?: boolean;
  configuration: string; // unique combo of input type and prototype
  condition: string;
  prototype: string;
  title: string;
  description: string;
}

export enum DragStatus {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  DRAGGING = "DRAGGING",
  IDLE = "IDLE",
}

export enum TaskType {
  LOADING = "LOADING",
  PRE_BLOCK = "PRE_BLOCK",
  BLOCK = "BLOCK",
  PRE_CALIBRATION = "PRE_CALIBRATION",
  CALIBRATION = "CALIBRATION",
  COMPLETE = "COMPLETE",
}

export interface AppStatus {
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

  public static subscribeStatus(cb: (s: AppStatus) => void) {
    const participantRef = doc(this.getDb(), version, `${this.pid}`);
    return onSnapshot(participantRef, (doc) => {
      const data = doc.data();
      if (data !== undefined) {
        cb(data as AppStatus);
      }
    });
  }

  public static start() {
    const actionsRef = doc(this.getDb(), "actions", `${this.pid}`);
    return setDoc(actionsRef, { ready: true });
  }
}

export default Database;
