import type { User } from "firebase/auth";

export interface FbState {
  user: User | null;
  cardsSaving: boolean;
}

export interface FbEvents {
  user: User | null;
  cardsSaving: boolean;
}
