import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import type { User } from "firebase/auth";
import { firebaseConfig } from "./config";
import { FbAuth } from "./modules/Auth";
import { StateDispatcher } from "../StateDispatcher";
import type { FbEvents, FbState } from "./type";

export class FireBaseRunner {
  private app: FirebaseApp;
  private auth: FbAuth;

  private dispatcher = new StateDispatcher<FbState, FbEvents>({}, {})

  constructor() {
    this.app = getApps()[0] ?? initializeApp(firebaseConfig);
    this.auth = new FbAuth(this.app);
  }

  public listen = this.dispatcher.listen;
  public getState = this.dispatcher.getState;

  public getCurrentUser(): User | null {
    return this.auth.getCurrentUser();
  }

  public onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return this.auth.onAuthStateChanged(callback);
  }

  public signInWithGoogle(): Promise<User> {
    return this.auth.signInWithGoogle();
  }

  public signOut(): Promise<void> {
    return this.auth.signOut();
  }
}
