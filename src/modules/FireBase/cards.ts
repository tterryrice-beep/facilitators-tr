import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import type { FirebaseApp } from "firebase/app";
import type { CardMap } from "@/Pages/Cards/components/cardboard/cardTypes";

export interface FirebaseCardsSnapshot {
  cards: CardMap;
  updatedAt: number;
}

export class FirebaseCards {
  private readonly firestore;

  constructor(app: FirebaseApp) {
    this.firestore = getFirestore(app);
  }

  public async read(userId: string): Promise<FirebaseCardsSnapshot | null> {
    const snapshot = await getDoc(this.getCardsDocument(userId));
    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    if (!data || typeof data.cards !== "object" || Array.isArray(data.cards)) {
      return null;
    }

    return {
      cards: data.cards as CardMap,
      updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : 0,
    };
  }

  public async write(
    userId: string,
    cards: CardMap,
    updatedAt = Date.now(),
  ): Promise<void> {
    await setDoc(this.getCardsDocument(userId), { cards, updatedAt });
  }

  private getCardsDocument(userId: string) {
    return doc(this.firestore, "users", userId, "cards", "board");
  }
}