import { initializeApp, type FirebaseApp } from "firebase/app";
import {} from "firebase/auth";
import { firebaseConfig } from "./config";
import { FbAuth } from "./modules/Auth";

export class FireBaseRunner {
  private app: FirebaseApp;
  private auth = new FbAuth();

  constructor() {
    this.app = initializeApp(firebaseConfig);
  }
}
