import React, { useEffect, useState } from "react";
import { LocaleManager } from "@/modules";

import { LocaleContext } from "./Context";
import type { LocaleManagerType } from "./type";
import { localeConfig, type LanguageKey } from "./locales";

interface Props {
  children?: React.ReactNode;
}
export const LocaleProvider: React.FC<Props> = ({ children }) => {
  const [manager, setManager] = useState<LocaleManagerType | null>(null);

  useEffect(() => {
    let mounted = true;
    const lm = new LocaleManager(
      localeConfig.defaultLanguage,
      localeConfig.languages.list,
    );

    lm.init(
      Object.keys(localeConfig.languages.data).reduce((acc, key) => {
        const code = key as unknown as LanguageKey;
        const lang = localeConfig.languages.data[code];
        const downloader = lang.download;

        return { ...acc, [code]: downloader };
      }, {}),
      () => {
        if (!mounted) return;
        setManager(lm);
      },
    );

    return () => {
      mounted = false;
      lm.destroy();
    };
  }, []);

  if (!manager) return "Завантаження менеджера локалізації...";

  return (
    <LocaleContext.Provider value={{ manager }}>
      {children}
    </LocaleContext.Provider>
  );
};
