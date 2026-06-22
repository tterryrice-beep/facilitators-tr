import type { LocaleManager } from "@/modules/LocaleSystem/Manager";

import en from "./locales/en.json";
import { localeConfig, type LanguageKey } from "./locales";

export interface LocaleContextType {
  manager: LocaleManager<typeof localeConfig.defaultLanguage, LanguageKey>;
}
export type LocaleManagerType = LocaleContextType["manager"];
