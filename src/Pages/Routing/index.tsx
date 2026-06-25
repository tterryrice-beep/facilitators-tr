import React, { type FC } from "react";
import { createPathRouter, setPage, setModal } from "path-router-red";
import { useTranslate } from "@/providers/LocaleProvider/hook";

import { ObjectView } from "@@/ObjectView";
import { Heading } from "@@/Heading";
import { JSXView } from "@@/JSXView";
import { Text } from "@@/Text";

import css from "./style.module.scss";
import { Pre } from "@@/Pre";
import { JSView } from "@@/JSView";
import { JS_VIEW_COLOR } from "@@/JSView/config";
import { usePath } from "@/providers/Router";

// const { modals, pages } = createRoute(route);

const Page: FC = ({}) => {
  const { getText, changeLanguage } = useTranslate();
  const { modal, page } = usePath();

  return (
    <div className={css.page}>
      <Heading title={"PathRouter"} rightBar={<div>github ling be here</div>} />

      <section id={css.about}>
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          Для чого взагалі існує PathRouter
        </Text>
        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          <b className="font-serif">I</b>. Типізація
        </Text>
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
        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          <b className="font-serif">II</b>. Модальні Вікна
        </Text>
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

        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          Можливості
        </Text>

        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          <b className="font-serif">I</b>. Зручна та декларативна робота з
          маршрутами
        </Text>

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
        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          <b className="font-serif">II</b>. Зручна Типізована Навігація
        </Text>
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
          Завдяки автозаповненню, PathRouter завжди підказує всі доступні шляхи
          які наявні в проекті
        </Text>
        <br />
        <Text type="small">
          <div className="ml-8 mt-2 mb-2">
            <span style={{ color: JS_VIEW_COLOR.keyword }}>const</span>
            {` `}
            <span
              style={{ color: JS_VIEW_COLOR.ident }}>{`{ page, modal }`}</span>
            <span
              style={{ color: JS_VIEW_COLOR.fn }}>{` = usePathRouter();`}</span>
            <br />
            <span style={{ color: JS_VIEW_COLOR.ident }}>page</span>
            <span style={{ color: JS_VIEW_COLOR.fn }}>.navigate(</span>
            <span
              style={{
                color: JS_VIEW_COLOR.string,
              }}>{`"about/privacy/`}</span>
            <span
              className={css.cursor}
              style={{
                color: JS_VIEW_COLOR.punct,
                fontSize: "1.75em",
                position: "relative",
                bottom: "-0.1em",
                marginRight: "-0.1em",
                marginLeft: "-0.1em",
              }}>
              |
            </span>
            <span className="text-gray-400">{`preferences/`}</span>
            <span style={{ color: JS_VIEW_COLOR.string }}>{`"`}</span>
            <span style={{ color: JS_VIEW_COLOR.fn }}>)</span>
            {`;`}
          </div>
        </Text>
        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          <b className="font-serif">III</b>. URL-орієнтовані модальні вікна
        </Text>
        <Text>
          PathRouter надає єдине джерело істини для підтвердження наявності
          модального вікна та його параметрів: URL адреса. Й надає для роботи з
          ними простий та зрозумілий API:
          <br />
          <JSView>{`
const {modal} = usePath()
modal.open("wallet");
modal.close();
`}</JSView>
        </Text>
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          Швидкий Старт
        </Text>
        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          <b className="font-serif">I</b>. Встановлення
        </Text>
        <Text>Для використання PathRouter, слід встановити його із npm:</Text>
        <br />
        <br />
        <Pre>
          <a href="https://www.npmjs.com/package/path-router-red">
            npm i path-router-red
          </a>
        </Pre>

        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          <b className="font-serif">II</b>. Ініціалізація
        </Text>
        <Text>
          В цілях безпеки та типізації, PathRouter створюється через фабрику, у
          яку передається <Pre inline>route-config</Pre>
        </Text>
        <br />
        <Text>
          Конфігація розбивається на дві секції: pages та modals. Модальні вікна
          лишаються однорівневими, в той час як сторінки можна загортати одна у
          одну.
          <br />
          Простий приклад для створення PathRouter:
        </Text>
        <JSView>{`routes.ts
----------------------------------------
import { createPathRouter, setPage, setModal } from "path-router-red";

import { Home, NotFound } from "pages"; // your pages
import { WalletModal } from "modals"; // your modals

const routes = createPathRouter({
  pages: {
      "/": setPage(Home),
      "*": setPage(NotFound),
  },
  modals: {
    wallet: setModal(WalletModal),
  },
});


export const {
  NavLink,
  PathProvider,
  PagesContainer,
  getModal,
  getPath,
  usePath,
  config,
} = routes;

Layout.tsx
----------------------------------------
import { PathProvider, PagesContainer } from "routes";

export const Layout = () => (
  <PathProvider>
    <PagesContainer />
  </PathProvider>
);


page.tsx
----------------------------------------
import { NavLink, usePath } from "routes";

export const Page = () => {
    const { modal } = usePath();
  
  return (
  <div>
    <NavLink to="/">Home</NavLink>
    <button onClick={() => modal.open("wallet")}>Open Wallet</button>
  </div>
);
`}</JSView>

        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          Router Tree
        </Text>

        <Text className="mb-3 block">
          Головна особливість PathRouter полягає у багаторівневій вкладеності
          сторінок
        </Text>
        <Text className="mb-3 block">
          Для формування цього ланцюжка використовується функція{" "}
          <Pre inline>setPage</Pre>. Саме вона формує та налаштовує конфіг для
          подальшої роботи із роутером.
        </Text>
        <Text className="mb-3 block">
          Все, що нам залишається, це просто передавати її у обʼєкт на
          потрібному рівні вкладеності:
        </Text>

        <JSView>{`


import { setPage } from "path-router-red";

const routes = {
  pages: {
      "/": setPage(Home),

      "modules": {
          ...setPage(Modules),
          routing: setPage(RoutingModule),
          locale: {
            ...setPage(LocaleModule),
            example: setPage(LocaleExample),
          },
          "*": setPage({redirect: "modules"}),
      },

      "*": setPage(NotFound),
  },
}


`}</JSView>

        <Text className="mb-3 block">
          Системна функція <Pre inline>createRoute</Pre> виводить повний шлях та
          дані сторінки для подальшого використання. Її можна використовувати,
          скажімо для створення мапи сайту, чи у debug цілях.
        </Text>
        <Text className="mb-3 block">
          <Pre inline>setPage</Pre> може приймати не лише безпосередньо
          компонент сторінки, але й обʼєкт з додатковими, кастомними
          параметрами, котрі <Pre inline>createRoute</Pre> виведе у зручному для
          роботи форматі:
        </Text>

        <ObjectView
          defaultExpanded
          data={{
            pages: [
              {
                pathName: "/",
                data: {
                  component: "<Home />",
                },
              },
            ],
          }}
        />

        <JSView>{`
{
  pathName: string;
  data: PageData;
}[]
        `}</JSView>
      </section>
    </div>
  );
};

export default Page;

const example = `routes.ts
----------------------------------------
import { createPathRouter, setPage, setModal } from "path-router-red";
import { Home, Modules, RoutingModule, LocaleModule, NotFound } from "pages";

const routes = createPathRouter({
  pages: {
      "/": setPage({ component: Home, title: "Home", icon: "/home.png" }),

      "modules": {
          ...setPage(Modules),
          routing: setPage(RoutingModule),
          locale: setPage(LocaleModule),
          "*": setPage({redirect: "modules"}),
      },

      "*": setPage({ component: NotFound }),
  },
  modals: {
    wallet: setModal(WalletModal),
    preferences: setModal({component: PreferencesModal, icon: "/preferences.png"}),
  },
});


export const {
  NavLink,
  PathProvider,
  PagesContainer,
  getModal,
  getPath,
  usePath,
  config,
} = createPathRouter(routes);

Layout.tsx
----------------------------------------
import { PathProvider, PagesContainer } from "routes";

export const Layout = () => (
  <PathProvider>
    <PagesContainer />
  </PathProvider>
);
`;
