import React, { type FC } from "react";
import { useTranslate } from "@/providers/LocaleProvider/hook";

import { ObjectView } from "@@/ObjectView";
import { Heading } from "@@/Heading";
import { Text } from "@@/Text";

import css from "./style.module.scss";
import { Pre } from "@@/Pre";
import { JSView } from "@@/JSView";
import { JS_VIEW_COLOR } from "@@/JSView/config";
import { NavLink } from "@/providers/Router";

const Page: FC = ({}) => {
  const { getText } = useTranslate();

  return (
    <div className={css.page}>
      <Heading
        title={"PathRouter"}
        rightBar={
          <div className="flex gap-3 items-center">
            <a
              href="https://github.com/tterryrice-beep/Path-Router"
              target="_blank">
              <img
                src="https://cdn.simpleicons.org/github/white"
                alt="git"
                className="h-6 w-auto"
              />
            </a>
            <a
              href="https://www.npmjs.com/package/path-router-red"
              target="_blank">
              <img
                src="https://img.shields.io/npm/v/path-router-red"
                alt="npm version"
              />
            </a>
          </div>
        }
      />

      <section id={css.about}>
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          {getText("PathRouter/reason")}
        </Text>
        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          <b className="font-serif">I</b>. {getText("PathRouter/typo/title")}
        </Text>
        <Text>{getText("PathRouter/typo/desc")}</Text>
        <br />
        <Text>{getText("PathRouter/typo/desc_2")}</Text>
        <br />
        <br />
        <Text>{getText("PathRouter/typo/desc_3")}</Text>
        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          <b className="font-serif">II</b>. {getText("PathRouter/modals/title")}
        </Text>
        <Text>
          {getText("PathRouter/modals/desc", {
            state: <Pre inline>state</Pre>,
          })}
        </Text>
        <br />
        <br />
        <Text>{getText("PathRouter/modals/desc_2")}</Text>
        <br />
        <br />
        <Text>{getText("PathRouter/modals/desc_3")}</Text>
        <Pre>
          {`
https://example.com/path/to/page/modal/wallet/balance
          `}
        </Pre>

        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          {getText("PathRouter/features/title")}
        </Text>

        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          <b className="font-serif">I</b>.{getText("PathRouter/features/desc")}
        </Text>

        <Text>{getText("PathRouter/features/desc_2")}</Text>
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
        <Text>{getText("PathRouter/features/desc_3")}</Text>
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
          <b className="font-serif">II</b>.
          {" " + getText("PathRouter/typo_nav/title")}
        </Text>
        <Text>{getText("PathRouter/typo_nav/desc")}</Text>
        <br />
        <Text>{getText("PathRouter/typo_nav/desc_2")}</Text>
        <br />
        <br />
        <Text>{getText("PathRouter/typo_nav/desc_3")}</Text>
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
          <b className="font-serif">III</b>.
          {" " + getText("PathRouter/url_modal/title")}
        </Text>
        <Text>
          {getText("PathRouter/url_modal/desc")}
          <br />
          <JSView>{`
const {modal} = usePath()
modal.open("wallet");
modal.close();
`}</JSView>
        </Text>
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          Швидкий Старт
          {getText("PathRouter/quick_start/title")}
        </Text>
        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          <b className="font-serif">I</b>.
          {getText("PathRouter/quick_start/install/title")}
        </Text>
        <Text>{getText("PathRouter/quick_start/install/desc")}</Text>
        <br />
        <br />
        <Pre>
          <a href="https://www.npmjs.com/package/path-router-red">
            npm i path-router-red
          </a>
        </Pre>

        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          <b className="font-serif">II</b>.
          {getText("PathRouter/quick_start/init/title")}
        </Text>
        <Text>
          {getText("PathRouter/quick_start/init/desc", {
            "route-config": <Pre inline>route-config</Pre>,
          })}
        </Text>
        <br />
        <Text>
          {getText("PathRouter/quick_start/init/desc_2")}
          <br />
          {getText("PathRouter/quick_start/init/desc_3")}
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
          <b>{getText("PathRouter/router-tree/title")}</b>
        </Text>

        <Text className="mb-3 block">
          {getText("PathRouter/router-tree/desc")}
        </Text>
        <Text className="mb-3 block">
          {getText("PathRouter/router-tree/desc_2", {
            setPage: <Pre inline>setPage</Pre>,
          })}
        </Text>
        <Text className="mb-3 block">
          {getText("PathRouter/router-tree/desc_3")}
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
          {getText("PathRouter/router-tree/desc_4", {
            parseRouteConfig: <Pre inline>parseRouteConfig</Pre>,
          })}
        </Text>

        <JSView>{`
import { parseRouteConfig } from "path-router-red";
const parsedRoutes = parseRouteConfig(routes);
const {pages } = parsedRoutes;
`}</JSView>

        <Text className="mb-3 block">
          {getText("PathRouter/router-tree/desc_5")}
        </Text>

        <ObjectView
          defaultExpanded
          data={{
            pages: [
              {
                pathName: "/",
                data: {
                  component: "<><Home /></>",
                },
              },
              {
                pathName: "modules",
                data: {
                  component: "<><Modules /></>",
                },
              },
              {
                pathName: "modules/routing",
                data: {
                  component: "<><RoutingModule /></>",
                },
              },
              {
                pathName: "modules/locale",
                data: {
                  component: "<><LocaleModule /></>",
                },
              },
              {
                pathName: "modules/locale/example",
                data: {
                  component: "<><LocaleExample /></>",
                },
              },
              {
                pathName: "modules/*",
                data: {
                  redirect: "modules",
                },
              },
              {
                pathName: "*",
                data: {
                  component: "<><NotFound /></>",
                },
              },
            ],
          }}
        />
        <br />

        <Text className="mb-3 block">
          {getText("PathRouter/router-tree/desc_6")}
          <br />
          {getText("PathRouter/router-tree/sitemap/text", {
            hereLink: (
              <NavLink to="map">
                <Pre>
                  {getText("PathRouter/router-tree/sitemap/hereLink_text")}
                </Pre>
              </NavLink>
            ),
          })}
        </Text>

        {/* ─────────────────── PagesContainer ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          <b>
            <Pre inline>PagesContainer</Pre>
          </b>
        </Text>
        <Text className="mb-3 block">
          {getText("PathRouter/pagesContainer/desc", {
            PagesContainer: <Pre inline>PagesContainer</Pre>,
          })}
          <br />
          {getText("PathRouter/pagesContainer/desc_2", {
            Routes: <Pre inline>{"<Routes>"}</Pre>,
            reactRouterDom: "react-router-dom",
            ModalsContainer: <Pre inline>ModalsContainer</Pre>,
          })}
          <br />
          {getText("PathRouter/pagesContainer/desc_3", {
            PagesContainer: <Pre inline>PagesContainer</Pre>,
          })}
        </Text>

        <JSView>{`Layout.tsx
----------------------------------------
import { PathProvider, PagesContainer } from "routes";
import { MyModalWrapper } from "components";

export const Layout = () => (
  <PathProvider>
    <Header />
    <main>
      <PagesContainer
        fallback={<Spinner />}
        ModalWrapper={MyModalWrapper}
      />
    </main>
    <Footer />
  </PathProvider>
);`}</JSView>

        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          <Pre inline>fallback</Pre>
        </Text>
        <Text className="mb-3 block">
          {getText("PathRouter/pagesContainer/fallback/desc", {
            fallback: <Pre inline>fallback</Pre>,
            suspense: <Pre inline>{"<Suspense>"}</Pre>,
            lazy: <Pre inline>React.lazy</Pre>,
            null: <Pre inline>null</Pre>,
          })}
        </Text>

        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          <Pre inline>ModalWrapper</Pre>
        </Text>
        <Text className="mb-3 block">
          <Pre inline>ModalWrapper</Pre> — необовʼязковий компонент-плагін для
          обгортки модального вмісту. Якщо його не передати — модалка
          рендериться прямо у DOM, без будь-якого контейнера чи анімації. Якщо
          передати — PathRouter відмалює поточний компонент модалки всередину
          нього, передаючи такі пропси:
        </Text>
        <ObjectView
          defaultExpanded
          data={{
            modalName:
              "string | undefined — ключ поточної модалки (перший сегмент після /modal/)",
            isOpen: "boolean — чи відкрита модалка зараз",
            onClose: "() => void — закриває модалку через роутер (змінює URL)",
            children:
              "ReactNode — вміст: компонент модалки з конфігу, вже wrapped у <Suspense>",
          }}
        />
        <Text className="mb-3 block mt-6">
          PathRouter також зчитує forwarded ref із методом{" "}
          <Pre inline>handleCloseWithAnimation()</Pre>. Якщо він присутній —
          замість негайного закриття через URL роутер спочатку викличе цей
          метод, даючи компоненту час завершити анімацію, і лише потім виконає
          перехід.
        </Text>
        <JSView>{`MyModalWrapper.tsx
----------------------------------------
import { forwardRef, useImperativeHandle } from "react";
import type { ModalWrapperProps, ModalWrapperRef } from "path-router-red";

export const MyModalWrapper = forwardRef<ModalWrapperRef, ModalWrapperProps>(
  ({ isOpen, onClose, children }, ref) => {
    useImperativeHandle(ref, () => ({
      handleCloseWithAnimation: () => {
        // запускаємо анімацію, потім закриваємо
        runCloseAnimation().then(onClose);
      },
    }));

    return (
      <div className={isOpen ? "modal open" : "modal"}>
        <button onClick={onClose}>✕</button>
        {children}
      </div>
    );
  }
);`}</JSView>

        {/* ─────────────────── getPath / getModal ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          getPath та getModal
        </Text>
        <Text className="mb-3 block">
          <Pre inline>getPath</Pre> та <Pre inline>getModal</Pre> — це
          identity-функції: вони просто повертають аргумент незміненим. Їхня
          єдина мета — TypeScript-звуження типу. Компілятор перевіряє, що
          переданий рядок є дійсним маршрутом або ключем модалки у вашому
          конфігу, й видає помилку, якщо він там відсутній.
        </Text>
        <Text className="mb-3 block">
          Корисні там, де немає доступу до <Pre inline>usePath</Pre> або{" "}
          <Pre inline>NavLink</Pre> — наприклад, у конфігах меню, масивах даних
          або утилітарних функціях:
        </Text>
        <JSView>{`
import { getPath, getModal } from "routes";

const menuItems = [
  { label: "Головна",  path: getPath("/") },
  { label: "Модулі",   path: getPath("modules") },
  { label: "Профіль",  path: getPath("profile") }, // ← помилка компіляції, якщо "profile" не існує
];

// Аналогічно для модалок:
const onOpen = () => modal.open(getModal("wallet"));
`}</JSView>

        {/* ─────────────────── NavLink ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          NavLink
        </Text>
        <Text className="mb-3 block">
          <Pre inline>NavLink</Pre> — роутер-свідомий замінник тегу{" "}
          <Pre inline>{"<a>"}</Pre>. Рендерить справжній <Pre inline>href</Pre>{" "}
          (тому правий клік → «Відкрити у новій вкладці», SSR та пошукові боти
          працюють коректно), але перехоплює основний клік лівою кнопкою та
          викликає <Pre inline>page.navigate</Pre> всередині SPA — без
          перезавантаження сторінки.
        </Text>
        <Text className="mb-3 block">
          Натискання з модифікаторами (Cmd / Ctrl / Shift / Alt) або з атрибутом{" "}
          <Pre inline>target</Pre> відмінним від <Pre inline>_self</Pre> —
          пропускаються, надаючи браузеру стандартну поведінку.
        </Text>

        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          Пропси
        </Text>
        <ObjectView
          defaultExpanded
          data={{
            to: "PathNamesOf<C>? — ціль навігації. Якщо не вказано — поточна сторінка зберігається",
            modal:
              "ModalNamesOf<C>? — модалка, яку слід відкрити після переходу",
            modalBreadCrumbs:
              "string[]? — додаткові сегменти, що додаються після назви модалки у URL",
            replace:
              "boolean? — замінити поточний запис у history замість додавання нового",
            navigateOptions:
              "NavigateOptions? — додаткові опції, що прокидаються у react-router navigate",
            activeClassName:
              "string? — CSS-клас, що застосовується до <a> коли посилання активне",
          }}
        />

        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          Активний стан
        </Text>
        <Text className="mb-3 block">
          NavLink вважається активним, якщо <Pre inline>page.path</Pre>{" "}
          збігається з <Pre inline>to</Pre>, а при наявності{" "}
          <Pre inline>modal</Pre> — ще й <Pre inline>modal.name</Pre> збігається
          із переданим ключем. Активному елементу виставляються{" "}
          <Pre inline>aria-current="page"</Pre> та <Pre inline>data-active</Pre>
          .
        </Text>

        <JSView>{`
import { NavLink } from "routes";

// Перехід на сторінку
<NavLink to="modules/routing">Routing</NavLink>

// Відкрити модалку без зміни сторінки
<NavLink modal="wallet">Гаманець</NavLink>

// Перехід на іншу сторінку + одночасно відкрити модалку
<NavLink to="users" modal="confirm" modalBreadCrumbs={["step-2"]}>
  Підтвердити
</NavLink>

// Власний клас для активного стану
<NavLink to="modules" activeClassName="border-b-2 border-white">
  Модулі
</NavLink>

// Заміна запису в history (без кнопки "Назад")
<NavLink to="onboarding" replace>
  Почати
</NavLink>
`}</JSView>

        {/* ─────────────────── usePath ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          usePath
        </Text>
        <Text className="mb-3 block">
          <Pre inline>usePath</Pre> — хук, що повертає весь стан роутера,
          типізований під ваш конфіг. Доступний у будь-якому компоненті, що
          знаходиться нижче <Pre inline>PathProvider</Pre> у дереві.
        </Text>
        <JSView>{`const { page, modal, searchParams } = usePath();`}</JSView>

        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          page
        </Text>
        <ObjectView
          defaultExpanded
          data={{
            "page.path":
              "string — поточний шлях сторінки (без /modal/… сегменту)",
            "page.navigate":
              "(path: PathNamesOf<C>, options?: NavigateOptions) => void — програмна навігація",
            "page.isHavePrevHistory":
              "boolean — false, якщо сторінку відкрито напряму (немає попередньої history)",
          }}
        />
        <JSView>{`
const { page } = usePath();

page.path // "modules/routing"

page.navigate("modules/routing");
page.navigate("modules/routing", { replace: true });

// кнопку "назад" показуємо лише якщо є попередня сторінка
{page.isHavePrevHistory && (
  <button onClick={() => history.back()}>← Назад</button>
)}
`}</JSView>

        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          modal
        </Text>
        <ObjectView
          defaultExpanded
          data={{
            "modal.isOpen": "boolean — чи відкрита зараз будь-яка модалка",
            "modal.name":
              "string | undefined — ключ відкритої модалки (перший сегмент після /modal/)",
            "modal.path":
              'string — повний modal-шлях разом із breadCrumbs, наприклад "wallet/balance"',
            "modal.breadCrumbs":
              "string[] — додаткові сегменти після імені модалки",
            "modal.open":
              "(name: ModalNamesOf<C>, breadCrumbs?: string[]) => void — відкриває модалку",
            "modal.close":
              "() => void — закриває модалку, повертаючи до поточної сторінки",
          }}
        />
        <JSView>{`
const { modal } = usePath();

modal.open("wallet");
// URL: /page/modal/wallet

modal.open("wallet", ["balance"]);
// URL: /page/modal/wallet/balance

modal.isOpen      // true
modal.name        // "wallet"
modal.path        // "wallet/balance"
modal.breadCrumbs // ["balance"]

modal.close();
// URL: /page
`}</JSView>

        {/* ─────────────────── Search Params ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          Search Params
        </Text>
        <Text className="mb-3 block">
          PathRouter надає повноцінне API для роботи з параметрами запиту (query
          string). Всі значення зберігаються як{" "}
          <Pre inline>{"Record<string, string[]>"}</Pre> — кожен ключ завжди є
          масивом, навіть якщо передано лише одне значення. Це спрощує роботу із
          множинними значеннями одного параметра (наприклад,{" "}
          <Pre inline>?tag=a&tag=b</Pre>).
        </Text>
        <ObjectView
          defaultExpanded
          data={{
            "searchParams.params":
              "Record<string, string[]> — реактивний знімок поточних параметрів",
            "searchParams.change":
              "merge: рядок → встановлює одне значення, масив → додає до наявних. Не зачіпає інші ключі",
            "searchParams.set":
              "replace: повністю замінює значення ключа (не зачіпає інші ключі)",
            "searchParams.delete":
              "(key: string) => void — видаляє конкретний ключ",
            "searchParams.clear": "() => void — очищає всі search params",
          }}
        />
        <JSView>{`
const { searchParams } = usePath();

// Читання
searchParams.params           // { tab: ["settings"], tag: ["a", "b"] }
searchParams.params["tab"]?.[0]  // "settings"

// change — merge: нові значення додаються до наявних
searchParams.change({ tab: "profile" });         // ?tab=profile (перезаписує tab)
searchParams.change({ tag: ["c", "d"] });        // ?tab=profile&tag=a&tag=b&tag=c&tag=d

// set — replace: повністю замінює лише цей ключ, решта незмінна
searchParams.set({ tab: "dashboard" });          // ?tab=dashboard&tag=a&tag=b

// Видалення
searchParams.delete("tag");                      // ?tab=dashboard
searchParams.clear();                            // ?  (порожньо)
`}</JSView>
        <Text className="mb-3 block mt-4">
          Усі операції зберігають поточний URL (pathname, /modal/… сегмент та
          hash) — змінюється виключно рядок запиту.
        </Text>

        {/* ─────────────────── Redirects ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          Редіректи
        </Text>
        <Text className="mb-3 block">
          Щоб перенаправити користувача на інший шлях, передайте{" "}
          <Pre inline>{"{ redirect: 'path' }"}"</Pre> у{" "}
          <Pre inline>setPage</Pre> замість компонента. PathRouter підставить{" "}
          <Pre inline>{"<Navigate to={redirect} replace />"}</Pre> від
          react-router-dom. Найчастіше редіректи використовують із символом{" "}
          <Pre inline>*</Pre> (catch-all), щоб обробити невідомі вкладені
          маршрути:
        </Text>
        <JSView>{`
const routes = {
  pages: {
    "/": setPage(Home),

    "modules": {
      ...setPage(Modules),
      routing: setPage(RoutingModule),

      // будь-який невідомий /modules/??? → /modules
      "*": setPage({ redirect: "modules" }),
    },

    // глобальний 404
    "*": setPage(NotFound),
  },
};
`}</JSView>

        {/* ─────────────────── Обмеження ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          Обмеження
        </Text>
        <Text className="mb-3 block">
          PathRouter добре вирішує свою задачу, але підходить не для кожного
          сценарію:
        </Text>

        <Text className="ml-8 mt-8 mb-2" tag="h3" type="subtitle">
          Тільки BrowserRouter / тільки CSR
        </Text>
        <Text className="mb-3 block">
          <Pre inline>PathProvider</Pre> всередині використовує{" "}
          <Pre inline>{"<BrowserRouter>"}</Pre> із react-router-dom. Це означає
          відсутність підтримки HashRouter, а також несумісність із серверним
          рендерингом (Next.js, Remix тощо), де керування роутером відбувається
          на рівні фреймворку.
        </Text>

        <Text className="ml-8 mt-6 mb-2" tag="h3" type="subtitle">
          Зарезервований сегмент <Pre inline>/modal/</Pre>
        </Text>
        <Text className="mb-3 block">
          PathRouter розрізняє сторінку та модалку, розбиваючи URL по
          роздільнику <Pre inline>/modal/</Pre>. Жоден маршрут сторінки не
          повинен містити цей сегмент у своєму шляху, оскільки він буде
          інтерпретований як відкриття модалки.
        </Text>

        <Text className="ml-8 mt-6 mb-2" tag="h3" type="subtitle">
          Модалки — плоский список, одна за раз
        </Text>
        <Text className="mb-3 block">
          Секція <Pre inline>modals</Pre> у конфігу є плоским словником:
          вкладені модалки та одночасне відображення кількох модалок не
          підтримуються. Навігація всередині однієї модалки реалізується через{" "}
          <Pre inline>modalBreadCrumbs</Pre>, а не через запуск нової модалки
          поверх.
        </Text>

        <Text className="ml-8 mt-6 mb-2" tag="h3" type="subtitle">
          Анімація — виключно через ModalWrapper
        </Text>
        <Text className="mb-3 block">
          PathRouter не має вбудованих анімацій: модалки зʼявляються та зникають
          миттєво. Для анімованих переходів необхідно реалізувати власний{" "}
          <Pre inline>ModalWrapper</Pre> із методом{" "}
          <Pre inline>handleCloseWithAnimation</Pre>.
        </Text>

        <Text className="ml-8 mt-6 mb-2" tag="h3" type="subtitle">
          Глибина вкладеності — до 8 рівнів
        </Text>
        <Text className="mb-3 block">
          TypeScript-рекурсія типів у <Pre inline>PageEntries</Pre> обмежена 8
          рівнями вкладеності маршрутів. Проекти з глибшим деревом
          компілюватимуться без помилок, але автодоповнення для глибинних шляхів
          може спрацьовувати некоректно.
        </Text>
      </section>
    </div>
  );
};

export default Page;
