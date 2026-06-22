import type { ObjectAddress } from "@/types";

import { StateDispatcher } from "../StateDispatcher";
import type {
  LocaleState,
  LocaleEvents,
  TranslationProps,
  SystemState,
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
        translationLoaded: false,
      },
      {
        selectedLanguage: (state, value) => {
          state.selectedLanguage = value;
        },
        translationLoaded: (state, value) => {
          state.translationLoaded = value;
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

    for (const part of key.split(".")) {
      current = current?.[part];

      if (current === undefined) {
        return key;
      }
    }
    return typeof current === "string" ? current : key;
  };

  private formatMessage = <Values extends Record<string, string | unknown>>(
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

  private getTranslation = (key: LangName) => {
    try {
      const { languageList, translations } = this.systemState;

      const currentTranslation = translations[key];

      if (currentTranslation) return currentTranslation;

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
    const savedLanguage = localStorage.getItem("language");
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

  public changeLanguage = async (language: LangName) => {
    this.setters.translationLoaded(false);
    const isDownloaded = this.getTranslation(language);
    if (!isDownloaded) {
      const downloader = this.downloaders[language];
      if (downloader) {
        const config = await downloader();
        this.systemState.translations[language] = config;
      }
    }

    this.setters.selectedLanguage(language);
    this.setters.translationLoaded(true);
  };

  public getText = <Values extends Record<string, string | unknown>>(
    id: ObjectAddress<LangConfig>,
    values?: Values,
  ) => {
    return this.formatMessage<Values>({ id, values });
  };

  public destroy = () => {
    this.destroyDispatcher();
  };
}
