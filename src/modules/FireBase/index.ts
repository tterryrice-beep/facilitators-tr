import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import type { User } from "firebase/auth";
import { firebaseConfig } from "./config";
import { FbAuth } from "./modules/Auth";
import { StateDispatcher } from "../StateDispatcher";
import type { FbEvents, FbState } from "./type";

export class FireBaseRunner extends StateDispatcher<FbState, FbEvents> {
  private readonly app: FirebaseApp;
  private readonly auth: FbAuth;
  private readonly unsubscribeAuthState: () => void;

  constructor() {
    super(
      { user: null },
      {
        user: (state, user) => {
          state.user = user;
        },
      },
    );

    this.app = getApps()[0] ?? initializeApp(firebaseConfig);
    this.auth = new FbAuth(this.app);

    this.unsubscribeAuthState = this.auth.onAuthStateChanged((user) => {
      this.setters.user(user);
    });
  }

  public getCurrentUser(): User | null {
    return this.getState().user;
  }

  public signInWithGoogle(): Promise<User> {
    return this.auth.signInWithGoogle();
  }

  public signOut(): Promise<void> {
    return this.auth.signOut();
  }

  public destroy(): void {
    this.unsubscribeAuthState();
    this.destroyDispatcher();
  }
}
