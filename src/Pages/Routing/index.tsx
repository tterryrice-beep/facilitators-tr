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
import { ScrollBox } from "@@/ScrollBox";
import { JSX_VIEW_COLORS, JSXView } from "@@/JSXView";

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
        <ScrollBox minWidth={340}>
          <Text type="small">
            <div className="ml-8 mt-2 mb-2">
              <span style={{ color: JS_VIEW_COLOR.keyword }}>const</span>
              {` `}
              <span
                style={{
                  color: JS_VIEW_COLOR.ident,
                }}>{`{ page, modal }`}</span>
              <span
                style={{
                  color: JS_VIEW_COLOR.fn,
                }}>{` = usePathRouter();`}</span>
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
        </ScrollBox>
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
        <ScrollBox>
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
        </ScrollBox>
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
        <ScrollBox minWidth={400}>
          <JSView>{`import { setPage } from "path-router-red";

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
}`}</JSView>
        </ScrollBox>
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
        <ScrollBox minWidth={340}>
          <JSView>{`Layout.tsx
---------------------------------------
import { 
  PathProvider,
  PagesContainer
} from "routes";
import {
  MyModalWrapper
} from "components";

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
        </ScrollBox>
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
          {getText("PathRouter/pagesContainer/modalWrapper/desc", {
            ModalWrapper: <Pre inline>ModalWrapper</Pre>,
          })}
        </Text>
        <ObjectView
          defaultExpanded
          data={{
            modalName: "string | undefined",
          }}
        />
        <div
          className="mb-8"
          dangerouslySetInnerHTML={{
            __html: getText("PathRouter/pagesContainer/modalWrapper/modalName"),
          }}
        />

        <ObjectView
          defaultExpanded
          data={{
            isOpen: "boolean",
          }}
        />
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/pagesContainer/modalWrapper/isOpen")}
          </span>
        </div>

        <ObjectView
          defaultExpanded
          data={{
            onClose: "() => void",
          }}
        />
        <div
          className="mb-8 "
          dangerouslySetInnerHTML={{
            __html: getText("PathRouter/pagesContainer/modalWrapper/onClose"),
          }}
        />

        <ObjectView
          defaultExpanded
          data={{
            children: "ReactNode",
          }}
        />
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/pagesContainer/modalWrapper/children", {
              Suspense: (
                <span
                  style={{
                    color: JSX_VIEW_COLORS.punct,
                  }}>
                  {"<"}
                  <span
                    style={{
                      color: JSX_VIEW_COLORS.component,
                    }}>
                    {"Suspense"}
                  </span>
                  {"/>"}
                </span>
              ),
            })}
          </span>
        </div>

        <Text className="mb-3 block mt-6">
          {getText("PathRouter/pagesContainer/modalWrapper/ref", {
            handleCloseWithAnimation: (
              <Pre inline>handleCloseWithAnimation()</Pre>
            ),
          })}
        </Text>

        <ScrollBox minWidth={500}>
          <JSView>{`MyModalWrapper.tsx
----------------------------------------
import {
  forwardRef,
  useImperativeHandle
} from "react";
import type {
  ModalWrapperProps,
  ModalWrapperRef
} from "path-router-red";


export const MyModalWrapper = forwardRef<ModalWrapperRef, ModalWrapperProps>(
  ({ isOpen, onClose, children }, ref) => {
    useImperativeHandle(ref, () => ({
      handleCloseWithAnimation: () => {
        // ${getText("PathRouter/pagesContainer/modalWrapper/animation_comment")}
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
        </ScrollBox>

        {/* ─────────────────── getPath / getModal ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          <Pre inline>getPath and getModal</Pre>
        </Text>
        <Text className="mb-3 block">
          {getText("PathRouter/getPath/desc", {
            getPath: <Pre inline>getPath</Pre>,
            getModal: <Pre inline>getModal</Pre>,
          })}
        </Text>
        <Text className="mb-3 block">
          {getText("PathRouter/getPath/desc_2", {
            usePath: <Pre inline>usePath</Pre>,
            NavLink: <Pre inline>NavLink</Pre>,
          })}
        </Text>
        <ScrollBox minWidth={740}>
          <JSView>{`
import { getPath, getModal } from "routes";

const menuItems = [
  { label: "${getText("PathRouter/getPath/home")}",  path: getPath("/") },
  { label: "${getText("PathRouter/getPath/modules")}",   path: getPath("modules") },
  { label: "${getText("PathRouter/getPath/profile")}",  path: getPath("profile") }, // ← ${getText("PathRouter/getPath/compile_error")}
];

// ${getText("PathRouter/getPath/modals_analog")}
const onOpen = () => modal.open(getModal("wallet"));
`}</JSView>
        </ScrollBox>

        {/* ─────────────────── NavLink ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          NavLink
        </Text>
        <Text className="mb-3 block">
          {getText("PathRouter/navLink/desc", {
            NavLink: <Pre inline>NavLink</Pre>,
            a: <Pre inline>{"<a>"}</Pre>,
            href: <Pre inline>href</Pre>,
            pageNavigate: <Pre inline>page.navigate</Pre>,
          })}
        </Text>
        <Text className="mb-3 block">
          {getText("PathRouter/navLink/desc_2", {
            target: <Pre inline>target</Pre>,
            self: <Pre inline>_self</Pre>,
          })}
        </Text>
        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          {getText("PathRouter/navLink/props")}
        </Text>

        <ObjectView
          defaultExpanded
          data={{
            to: "PagePath",
          }}
        />
        <div className="mb-8">
          <span className="text-sm">{getText("PathRouter/navLink/to")}</span>
        </div>

        <ObjectView
          defaultExpanded
          data={{
            modal: "ModalPath",
          }}
        />
        <div className="mb-8">
          <span className="text-sm">{getText("PathRouter/navLink/modal")}</span>
        </div>

        <ObjectView
          defaultExpanded
          data={{
            modalBreadCrumbs: "string[]",
          }}
        />
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/navLink/modalBreadCrumbs")}
          </span>
        </div>

        <ObjectView
          defaultExpanded
          data={{
            replace: "boolean",
          }}
        />
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/navLink/replace")}
          </span>
        </div>

        <ObjectView
          defaultExpanded
          data={{
            navigateOptions: "NavigateOptions",
          }}
        />
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/navLink/navigateOptions")}
          </span>
        </div>

        <ObjectView
          defaultExpanded
          data={{
            activeClassName: "string",
          }}
        />
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/navLink/activeClassName")}
          </span>
        </div>

        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          {getText("PathRouter/navLink/active/title")}
        </Text>
        <Text className="mb-3 block">
          {getText("PathRouter/navLink/active/desc", {
            pagePath: (
              <span className="text-nowrap text-orange-400">page.path</span>
            ),
            to: <span className="text-nowrap text-orange-400">to</span>,
            modal: <span className="text-nowrap text-orange-400">modal</span>,
            modalName: (
              <span className="text-nowrap text-orange-400">modal.name</span>
            ),
            ariaCurrent: (
              <span className="text-nowrap text-orange-400">
                aria-current="page"
              </span>
            ),
            dataActive: (
              <span className="text-nowrap text-orange-400">data-active</span>
            ),
          })}
        </Text>
        <ScrollBox>
          <JSView>{`
import { NavLink } from "routes";

// ${getText("PathRouter/navLink/examples/navigate_page")}
<NavLink to="modules/routing">Routing</NavLink>

// ${getText("PathRouter/navLink/examples/open_modal")}
<NavLink modal="wallet">Wallet</NavLink>

// ${getText("PathRouter/navLink/examples/navigate_and_open_modal")}
<NavLink to="users" modal="confirm" modalBreadCrumbs={["step-2"]}>
  ${getText("PathRouter/navLink/examples/confirm")}
</NavLink>

// ${getText("PathRouter/navLink/examples/active_class")}
<NavLink to="modules" activeClassName="border-b-2 border-white">
  ${getText("PathRouter/navLink/examples/modules")}
</NavLink>

// ${getText("PathRouter/navLink/examples/replace_history")}
<NavLink to="onboarding" replace>
  ${getText("PathRouter/navLink/examples/start")}
</NavLink>
`}</JSView>
        </ScrollBox>
        {/* ─────────────────── usePath ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          usePath
        </Text>
        <Text className="mb-3 block">
          {getText("PathRouter/usePath/desc", {
            usePath: <Pre inline>usePath</Pre>,
            PathProvider: <Pre inline>PathProvider</Pre>,
          })}
        </Text>
        <JSView>{`const { page, modal, searchParams } = usePath();`}</JSView>
        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          page
        </Text>
        <ObjectView
          defaultExpanded
          data={{
            "page.path": "string",
          }}
        />
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/usePath/pagePath")}
          </span>
        </div>

        <ScrollBox minWidth={600}>
          <ObjectView
            defaultExpanded
            data={{
              "page.navigate":
                "(path: PagePath, options?: NavigateOptions) => void",
            }}
          />
        </ScrollBox>
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/usePath/pageNavigate")}
          </span>
        </div>

        <ObjectView
          defaultExpanded
          data={{
            "page.isHavePrevHistory": "boolean",
          }}
        />
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/usePath/pageIsHavePrevHistory")}
          </span>
        </div>
        <ScrollBox minWidth={500}>
          <JSView>{`
const { page } = usePath();

page.path // "modules/routing"

page.navigate("modules/routing");
page.navigate("modules/routing", { replace: true });

// ${getText("PathRouter/usePath/back_button_condition")}
{page.isHavePrevHistory && (
  <button onClick={() => history.back()}>${getText("PathRouter/usePath/back")}</button>
)}
`}</JSView>
        </ScrollBox>
        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          modal
        </Text>
        <ObjectView
          defaultExpanded
          data={{
            "modal.isOpen": "boolean",
          }}
        />
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/usePath/modalIsOpen")}
          </span>
        </div>

        <ObjectView
          defaultExpanded
          data={{
            "modal.name": "string | undefined",
          }}
        />
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/usePath/modalName")}
          </span>
        </div>

        <ObjectView
          defaultExpanded
          data={{
            "modal.path": "string",
          }}
        />
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/usePath/modalPath")}
          </span>
        </div>

        <ObjectView
          defaultExpanded
          data={{
            "modal.breadCrumbs": "string[]",
          }}
        />
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/usePath/modalBreadCrumbs")}
          </span>
        </div>

        <ScrollBox minWidth={600}>
          <ObjectView
            defaultExpanded
            data={{
              "modal.open": "(name: ModalPath, breadCrumbs?: string[]) => void",
            }}
          />
        </ScrollBox>
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/usePath/modalOpen")}
          </span>
        </div>

        <ObjectView
          defaultExpanded
          data={{
            "modal.close": "() => void",
          }}
        />
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/usePath/modalClose")}
          </span>
        </div>

        <ScrollBox>
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
        </ScrollBox>

        {/* ─────────────────── Search Params ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          Search Params
        </Text>
        <Text className="mb-3 block">
          {getText("PathRouter/searchParams/desc", {
            record: <Pre inline>{"Record<string, string[]>"}</Pre>,
            tag: <Pre inline>?tag=a&tag=b</Pre>,
          })}
        </Text>
        <ScrollBox minWidth={430}>
          <ObjectView
            defaultExpanded
            data={{
              "searchParams.params": "Record<string, string[]>",
            }}
          />
        </ScrollBox>
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/searchParams/params")}
          </span>
        </div>

        <ScrollBox minWidth={640}>
          <ObjectView
            defaultExpanded
            data={{
              "searchParams.change":
                "(state: Record<string, string | string[]>) => void",
            }}
          />
        </ScrollBox>
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/searchParams/change")}
          </span>
        </div>
        <ScrollBox minWidth={640}>
          <ObjectView
            defaultExpanded
            data={{
              "searchParams.set":
                "(next: Record<string, string | string[]>) => void",
            }}
          />
        </ScrollBox>
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/searchParams/set")}
          </span>
        </div>
        <ScrollBox minWidth={420}>
          <ObjectView
            defaultExpanded
            data={{
              "searchParams.delete": "(key: string) => void",
            }}
          />
        </ScrollBox>
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/searchParams/delete")}
          </span>
        </div>

        <ObjectView
          defaultExpanded
          data={{
            "searchParams.clear": "() => void",
          }}
        />
        <div className="mb-8">
          <span className="text-sm">
            {getText("PathRouter/searchParams/clear")}
          </span>
        </div>

        <ScrollBox minWidth={440}>
          <JSView>{`
const { searchParams } = usePath();
/* ${getText("PathRouter/searchParams/read")} */

searchParams.params 
// { tab: ["settings"], tag: ["a", "b"] }

searchParams.params["tab"]?.[0]  // "settings"

/* ${getText("PathRouter/searchParams/change_merge")} */

searchParams.change({ tab: "profile" });
// ?tab=profile (${getText("PathRouter/searchParams/overwrite_tab")})

searchParams.change({ tag: ["c", "d"] });
// ?tab=profile&tag=a&tag=b&tag=c&tag=d

/* ${getText("PathRouter/searchParams/set_replace")} */

searchParams.set({ tab: "dashboard" });
// ?tab=dashboard&tag=a&tag=b

/* ${getText("PathRouter/searchParams/delete_title")} */

searchParams.delete("tag"); // ?tab=dashboard

searchParams.clear();
// ?  (${getText("PathRouter/searchParams/empty")})
`}</JSView>
        </ScrollBox>

        <Text className="mb-3 block mt-4">
          {getText("PathRouter/searchParams/footer")}
        </Text>
        {/* ─────────────────── Redirects ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          {getText("PathRouter/redirects/title")}
        </Text>
        <Text className="mb-3 block">
          {getText("PathRouter/redirects/desc", {
            redirect: <Pre inline>{"{ redirect: 'path' }"}</Pre>,
            setPage: <Pre inline>setPage</Pre>,
            navigate: <Pre inline>{"<Navigate to={redirect} replace />"}</Pre>,
            catchAll: <Pre inline>*</Pre>,
          })}
        </Text>
        <ScrollBox>
          <JSView>{`
const routes = {
  pages: {
    "/": setPage(Home),

    "modules": {
      ...setPage(Modules),
      routing: setPage(RoutingModule),

      // ${getText("PathRouter/redirects/unknown_modules")}
      "*": setPage({ redirect: "modules" }),
    },

    // ${getText("PathRouter/redirects/global_404")}
    "*": setPage(NotFound),
  },
};
`}</JSView>
        </ScrollBox>

        {/* ─────────────────── Обмеження ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          {getText("PathRouter/limits/title")}
        </Text>
        <Text className="mb-3 block">{getText("PathRouter/limits/desc")}</Text>
        <Text className="ml-8 mt-8 mb-2" tag="h3" type="subtitle">
          {getText("PathRouter/limits/browserRouter/title")}
        </Text>
        <Text className="mb-3 block">
          {getText("PathRouter/limits/browserRouter/desc", {
            PathProvider: <Pre inline>PathProvider</Pre>,
            BrowserRouter: <Pre inline>{"<BrowserRouter>"}</Pre>,
          })}
        </Text>
        <Text className="ml-8 mt-6 mb-2" tag="h3" type="subtitle">
          {getText("PathRouter/limits/modalSegment/title", {
            modalSegment: <Pre inline>/modal/</Pre>,
          })}
        </Text>
        <Text className="mb-3 block">
          {getText("PathRouter/limits/modalSegment/desc", {
            modalSegment: <Pre inline>/modal/</Pre>,
          })}
        </Text>
        <Text className="ml-8 mt-6 mb-2" tag="h3" type="subtitle">
          {getText("PathRouter/limits/flatModals/title")}
        </Text>
        <Text className="mb-3 block">
          {getText("PathRouter/limits/flatModals/desc", {
            modals: <Pre inline>modals</Pre>,
            modalBreadCrumbs: <Pre inline>modalBreadCrumbs</Pre>,
          })}
        </Text>
        <Text className="ml-8 mt-6 mb-2" tag="h3" type="subtitle">
          {getText("PathRouter/limits/animation/title")}
        </Text>
        <Text className="mb-3 block">
          {getText("PathRouter/limits/animation/desc", {
            ModalWrapper: <Pre inline>ModalWrapper</Pre>,
            handleCloseWithAnimation: (
              <Pre inline>handleCloseWithAnimation</Pre>
            ),
          })}
        </Text>
        <Text className="ml-8 mt-6 mb-2" tag="h3" type="subtitle">
          {getText("PathRouter/limits/depth/title")}
        </Text>
        <Text className="mb-3 block">
          {getText("PathRouter/limits/depth/desc", {
            PageEntries: <Pre inline>PageEntries</Pre>,
          })}
        </Text>
      </section>
    </div>
  );
};

export default Page;
