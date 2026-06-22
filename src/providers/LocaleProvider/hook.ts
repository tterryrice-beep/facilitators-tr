import { useContext, useEffect, useMemo, useState } from "react";
import { LocaleContext } from "./Context";

const useLocale = () => useContext(LocaleContext);

export const useTranslate = () => {
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

  const getText = useMemo(() => manager.getText, [isLoading, currentLanguage]);

  return {
    getText,
    language: currentLanguage,
    loading: isLoading,
    changeLanguage: manager.changeLanguage,
  } as const;
};
