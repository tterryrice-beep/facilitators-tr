import type { ObjectAddress } from "@/types";

import { StateDispatcher } from "../StateDispatcher";
import {
  type LocaleState,
  type LocaleEvents,
  type TranslationProps,
  type SystemState,
  TranslationLocalData,
} from "./type";
import { interpolate } from "./utils";

export class LocaleManager<
  LangConfig extends object,
  LangName extends string,
> extends StateDispatcher<
  LocaleState<LangName, LangName[]>,
  LocaleEvents<LangName>
> {
  constructor(
    private defaultLanguageConfig: LangConfig,
    languageList: LangName[],
  ) {
    super(
      {
        selectedLanguage: "" as LangName,
        isLoadingActive: false,
      },
      {
        selectedLanguage: (state, value) => {
          state.selectedLanguage = value;
        },
        isLoadingActive: (state, value) => {
          state.isLoadingActive = value;
        },
      },
    );

    this.systemState.languageList = languageList;
  }

  private systemState: SystemState<LangName, LangConfig> = {
    languageList: [],
    translations: {},
  };
  private downloaders: Partial<Record<LangName, () => Promise<LangConfig>>> =
    {};

  private getTranslatedValueByKey = (key: string, translation: LangConfig) => {
    let current: any = translation;

    for (const part of key.split("/")) {
      current = current?.[part];

      if (current === undefined) {
        return key;
      }
    }
    return typeof current === "string" ? current : key;
  };

  private formatMessage = <
    Values extends Record<string, unknown> = Record<string, string>,
  >(
    props: TranslationProps<LangConfig, Values>,
  ) => {
    const { values, id } = props;

    const { lang, translation } = this.getSelectedLanguage();
    const translatedText = this.getTranslatedValueByKey(id, translation);
    const result = interpolate(translatedText, values);

    return result;
  };

  private getSelectedLanguage = () => {
    const lang = this.getState().selectedLanguage;
    const translation = this.getTranslation(lang);
    return { lang, translation };
  };

  private getTranslation = (lang: LangName) => {
    try {
      const { languageList, translations } = this.systemState;

      const currentTranslation = translations[lang];

      if (currentTranslation) return currentTranslation;
      else this.downloadLanguage(lang);

      return this.defaultLanguageConfig;
    } catch (error) {
      console.error(error);
      return this.defaultLanguageConfig;
    }
  };

  public async init<Lang extends string>(
    downloaders: Record<Lang, () => Promise<LangConfig>>,
    onLoad?: () => void,
  ) {
    this.downloaders = { ...this.downloaders, ...downloaders };

    // get saved language from storage
    const savedLanguage = localStorage.getItem(
      TranslationLocalData.SelectedLanguage,
    );
    if (
      savedLanguage &&
      this.systemState.languageList.includes(savedLanguage as LangName)
    ) {
      this.changeLanguage(savedLanguage as LangName);
    } else {
      // search lang from userAgent:
      const userAgentLanguagesWithOrder = navigator.languages;
      const foundLanguage = userAgentLanguagesWithOrder.find((lang) =>
        this.systemState.languageList.includes(lang as LangName),
      ) as LangName;
      if (foundLanguage) {
        this.changeLanguage(foundLanguage as LangName);
      } else {
        // set default language
        this.changeLanguage(this.systemState.languageList[0]);
      }
    }

    onLoad?.();
  }

  private downloadLanguage = async (language: LangName) => {
    try {
      if (this.getState().isLoadingActive) return;
      this.setters.isLoadingActive(true);
      const isDownloaded = !!this.systemState.translations[language];

      let result = false;
      if (isDownloaded) result = true;
      else {
        const downloader = this.downloaders[language];
        if (downloader) {
          const config = await downloader();
          this.systemState.translations[language] = config;
          result = true;
        }
      }

      this.setters.isLoadingActive(false);
      return result;
    } catch (error) {
      console.error({ error });
      this.setters.isLoadingActive(false);
      return false;
    }
  };

  public changeLanguage = async (language: LangName) => {
    localStorage.setItem(TranslationLocalData.SelectedLanguage, language);
    const success = await this.downloadLanguage(language);
    if (success) {
      this.setters.selectedLanguage(language);
    } else {
      console.error(`Failed to change language: ${language}`);
    }
  };

  public getText = <
    Values extends Record<string, unknown> = Record<string, string>,
  >(
    id: ObjectAddress<LangConfig>,
    values?: Values,
  ) => {
    return this.formatMessage<Values>({ id, values });
  };

  public destroy = () => {
    this.destroyDispatcher();
  };

  public getLanguagesList = (): LangName[] => this.systemState.languageList;
}
