import React, { type FC } from "react";

import { useTranslate } from "@/providers/LocaleProvider/hook";

import { ObjectView } from "@@/ObjectView";
import { Heading } from "@@/Heading";
import { JSXView } from "@@/JSXView";
import { Text } from "@@/Text";

import css from "./style.module.scss";
import { Pre } from "@@/Pre";
import { JSView } from "@@/JSView";

// const { modals, pages } = createRoute(route);

const Page: FC = ({}) => {
  const { getText, changeLanguage } = useTranslate();

  return (
    <div className={css.page}>
      <Heading title={"PathRouter"} rightBar={<div>github ling be here</div>} />

      <section id={css.about}>
        <Text tag="h2" type="subtitle">
          Для чого взагалі існує PathRouter
        </Text>
        <br />
        <br />

        <Text className="ml-8" tag="h3" type="subtitle">
          <b>I</b>. Типізація
        </Text>
        <br />

        <Text>
          В багатьох проектах над якими я працював підозріло часто траплялися
          проблеми із типізацією маршрутів.
        </Text>
        <br />
        <Text>
          Переважно, типізації взагалі не було. Доводиолся самостійно шукати
          лінк на потрібну сторінку. Крім того, трапляються й одруки, через що
          сторінка стає або недоступною, або прихованою.
        </Text>
        <br />
        <br />
        <Text>
          PathRouter використовує сувору типізацію маршрутів, що додає
          зручності, завдяки автодоповненню, та безпеку, оскільки непомічений чи
          проігнорований хибно вказаний шлях буде виявлено ще під час
          компіляції.
        </Text>
        <br />
        <br />
        <Text className="ml-8" tag="h3" type="subtitle">
          <b>II</b>. Модальні Вікна
        </Text>
        <br />
        <Text>
          Часто, в React-застосунках модальні вікна не є частиною навігації, а
          натомість їх поява привʼязується до <Pre inline>state</Pre>. В такому
          випадку стан модального вікна не зберігається безпосередньо у URL.
          Таким чином, юзер втрачає можливість зберегти модалку в закладках, або
          очікувати повторного відкрити після онолвення сторінки.
        </Text>
        <br />
        <br />
        <Text>
          Як банальний приклад: Гаманець у модалці. Його відкриття може бути
          абсолютно очевидним з точки зору UI але завжди буде користувач для
          якого принцципово відкривати сайт з інформації про свій баланс.
        </Text>
        <br />
        <br />
        <Text>
          PathRouter представляє модальне вікно як частину URL, при цьому
          візуально зручно передає усю інформацію:
        </Text>
        <Pre>
          {`
https://example.com/path/to/page/modal/wallet/balance
          `}
        </Pre>

        <br />
        <br />
        <br />
        <Text tag="h2" type="subtitle">
          Можливості
        </Text>
        <br />
        <br />

        <Text className="ml-8" tag="h3" type="subtitle">
          <b>I</b>. Зручна та декларативна робота з маршрутами
        </Text>
        <br />
        <br />
        <Text>
          Все, що потрібно прописати, це маршрутні ключі в обʼєкті конфігурації.
          Замість типового повтору одних і тих же ключів:
        </Text>
        <br />
        <ObjectView
          defaultExpanded
          data={{
            routes: [
              {
                path: "about",
              },
              {
                path: "about/terms",
              },
              {
                path: "about/privacy",
              },
              {
                path: "about/privacy/preferences",
              },
            ],
          }}
        />
        <br />
        <br />
        <Text>PathRouter спрощує це до зручної деревовидної структури:</Text>
        <br />
        <ObjectView
          defaultExpanded
          data={{
            routes: {
              about: {
                terms: {},
                privacy: {
                  preferences: {},
                },
              },
            },
          }}
        />
        <br />
        <br />
        <Text className="ml-8" tag="h3" type="subtitle">
          <b>II</b>. Зручна Типізована Навігація
        </Text>
        <br />
        <br />
        <Text>
          PathRouter вирішує головну, особисто мою, проблему із різними
          системами навігації: Відсутність ts-підказок за типової реалізації
          роутингу.
        </Text>
        <br />
        <Text>
          Не рідко доводиться лізти у файл чи компонент для самостійних пошуків
          потрібного посилання
        </Text>
        <br />
        <br />
        <Text>
          Завдяки автозаповненню, PathRouter завжди підказує всі можливі та
          доступні шляхи наявні в проекті
        </Text>
        <br />
        <Text>
          <div>
            <span className="text-cyan-400">const</span>
            {` `}
            <span className="text-blue-400">{`{ page, modal }`}</span>
            <span className="text-yellow-200">{` = usePathRouter();`}</span>
            <br />
            <span className="text-blue-400">page</span>
            <span className="text-yellow-200">.navigate(</span>
            <span className="text-orange-400">{`"about/privacy/"`}</span>
            <span className="text-gray-400">{`preferences`}</span>
            <span className="text-yellow-200">)</span>
            {`;`}
          </div>

          <JSView >{`
const { page, modal } = usePathRouter();
page.navigate("about/privacy");           
`}</JSView>
        </Text>
      </section>
    </div>
  );
};

export default Page;
