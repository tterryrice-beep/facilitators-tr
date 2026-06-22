import en from "./en.json";

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
  defaultLanguage: en,
  languages: {
    data: languages,
    list: Object.keys(languages) as LanguageKey[],
  },
} as const;
