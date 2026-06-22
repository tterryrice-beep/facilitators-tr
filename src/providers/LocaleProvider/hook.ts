import { useContext, useEffect, useState } from "react";
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
    const rmLoading = manager.listen("translationLoaded", setIsLoading);
    return () => {
      rmSelected();
      rmLoading();
    };
  }, []);

  return {
    getText: manager.getText,
    language: currentLanguage,
    loading: isLoading,
  } as const;
};
