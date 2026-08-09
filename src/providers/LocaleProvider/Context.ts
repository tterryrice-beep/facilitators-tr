import { createContext } from "react";
import type { LocaleContextType } from "./type";

export const LocaleContext = createContext<LocaleContextType>({
  manager: {} as LocaleContextType["manager"],
});
