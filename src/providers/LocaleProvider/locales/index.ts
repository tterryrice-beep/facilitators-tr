import en from "./en.json";
import uk from "./uk.json";

const languages = {
  en: {
    code: "en",
    name: "English",
    download: async () => en,
  },
  uk: {
    code: "uk",
    name: "Українська",
    download: async () => (await import("./uk.json")).default,
  },
} as const;

export type LanguageKey = keyof typeof languages;

export const localeConfig = {
  defaultLanguage: uk,
  languages: {
    data: languages,
    list: Object.keys(languages) as LanguageKey[],
  },
} as const;
