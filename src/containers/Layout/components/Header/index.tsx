import { type FC } from "react";

import { useTranslate } from "@/providers/LocaleProvider/hook";
import { LogoTR } from "@@/LogoTR";
import { Select } from "@@/Select";
import { Text } from "@@/Text";

export const Header: FC = () => {
  const { language, changeLanguage, getLanguagesList } = useTranslate();
  const languages = getLanguagesList();

  const index = languages.indexOf(language);

  return (
    <header className=" bg-mist-800 border-b-2 border-mist-600 ">
      <div className="mx-auto flex gap-3 flex-row items-center justify-between py-4 px-6 max-w-6xl">
        <div>
          <LogoTR />
        </div>

        <div className="flex items-center gap-2">
          <div>Navigation</div>
          <Select
            index={index}
            setIndex={(index) => {
              const newLang = languages[index];
              changeLanguage(newLang);
            }}>
            {languages.map((v) => {
              return (
                <Text className="px-2 py-1 block" type="small">
                  {v}
                </Text>
              );
            })}
          </Select>
        </div>
      </div>
    </header>
  );
};
