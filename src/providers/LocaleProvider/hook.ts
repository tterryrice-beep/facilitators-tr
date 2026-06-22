import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LocaleContext } from "./Context";

const useLocale = () => useContext(LocaleContext);

export const useTranslate = () => {
  "use no memo";
  const { manager } = useLocale();

  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurentLanguage] = useState(
    manager.getState().selectedLanguage,
  );

  useEffect(() => {
    const rmSelected = manager.listen("selectedLanguage", (lang) =>
      setCurentLanguage(lang),
    );
    const rmLoading = manager.listen("isLoadingActive", setIsLoading);
    return () => {
      rmSelected();
      rmLoading();
    };
  }, [manager]);

  /**
   * Re-wrap `manager.getText` on every language change so that React Compiler
   * (and any consumer relying on referential equality) invalidates cached
   * calls. The underlying manager state is mutable and invisible to the
   * compiler, so we must surface the dependency explicitly.
   */
  const getText = useCallback<typeof manager.getText>(
    (id, values) => {
      const lang = currentLanguage;
      const loadStatus = isLoading;
      const result = manager.getText(id, values);
      return result;
    },
    [manager, currentLanguage, isLoading],
  );

  return {
    getText,
    language: currentLanguage,
    loading: isLoading,
    changeLanguage: manager.changeLanguage,
  } as const;
};
