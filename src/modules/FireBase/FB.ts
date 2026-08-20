import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import type { User } from "firebase/auth";
import { firebaseConfig } from "./config";
import { FbAuth } from "./modules/Auth";
import { StateDispatcher } from "../StateDispatcher";
import type { FbEvents, FbState } from "./type";
import { FirebaseCards, type FirebaseCardsSnapshot } from "./cards";
import type { CardMap } from "@/Pages/Cards/components/cardboard/cardTypes";

export class FireBaseRunner extends StateDispatcher<FbState, FbEvents> {
  private readonly app: FirebaseApp;
  private readonly auth: FbAuth;
  private readonly cards: FirebaseCards;
  private readonly unsubscribeAuthState: () => void;

  constructor() {
    super(
      { user: null, cardsSaving: false },
      {
        user: (state, user) => {
          state.user = user;
        },
        cardsSaving: (state, cardsSaving) => {
          state.cardsSaving = cardsSaving;
        },
      },
    );

    this.app = getApps()[0] ?? initializeApp(firebaseConfig);
    this.auth = new FbAuth(this.app);
    this.cards = new FirebaseCards(this.app);

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

  public readCards(): Promise<FirebaseCardsSnapshot | null> {
    const user = this.getState().user;
    return user ? this.cards.read(user.uid) : Promise.resolve(null);
  }

  public writeCards(cards: CardMap, updatedAt = Date.now()): Promise<void> {
    const user = this.getState().user;
    if (!user) return Promise.resolve();

    this.setters.cardsSaving(true);
    return this.cards.write(user.uid, cards, updatedAt).finally(() => {
      this.setters.cardsSaving(false);
    });
  }

  public destroy(): void {
    this.unsubscribeAuthState();
    this.destroyDispatcher();
  }
}
