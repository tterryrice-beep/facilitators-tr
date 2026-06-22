import type { ObjectAddress } from "@/types";

export interface LocaleState<
  Language extends string,
  LocaleList extends Language[],
> {
  selectedLanguage: LocaleList[number];
  isLoadingActive: boolean;
}

export interface LocaleEvents<Language extends string> {
  selectedLanguage: Language;
  isLoadingActive: boolean;
}

export interface SystemState<
  Language extends string,
  LocaleExampleConfig extends object,
> {
  languageList: Language[];
  translations: Partial<Record<Language, LocaleExampleConfig>>;
}

export interface TranslationProps<
  LocaleExampleConfig extends object,
  Values extends Record<string, string | any>,
> {
  id: ObjectAddress<LocaleExampleConfig>;
  values?: Values;
}

export type TranslationResult<Values extends Record<string, unknown>> =
  Values extends Record<string, string> ? string : Array<Values[keyof Values]>;

export enum TranslationLocalData {
  SelectedLanguage = "language",
}