import type { User } from "firebase/auth";

export interface FbState {
  user: User | null;
}

export interface FbEvents {
  user: User | null;
}
