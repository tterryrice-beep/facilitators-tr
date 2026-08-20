import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from "firebase/auth";
import type { FirebaseApp } from "firebase/app";

export class FbAuth {
  private readonly auth: Auth;
  private readonly googleProvider: GoogleAuthProvider;

  constructor(app: FirebaseApp) {
    this.auth = getAuth(app);
    this.googleProvider = new GoogleAuthProvider();
  }

  public getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  public onAuthStateChanged(
    callback: (user: User | null) => void,
  ): () => void {
    return onAuthStateChanged(this.auth, callback);
  }

  public async signInWithGoogle(): Promise<User> {
    const result = await signInWithPopup(this.auth, this.googleProvider);
    return result.user;
  }

  public async signOut(): Promise<void> {
    await signOut(this.auth);
  }
}