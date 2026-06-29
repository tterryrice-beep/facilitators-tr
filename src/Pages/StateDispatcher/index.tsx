import React, { type FC } from "react";

import css from "./style.module.scss";
import { Heading } from "@@/Heading";
import { Text } from "@@/Text";
import { Pre } from "@@/Pre";
import { JSView } from "@@/JSView";
import { ObjectView } from "@@/ObjectView";
import { useTranslate } from "@/providers/LocaleProvider/hook";
import { JS_VIEW_COLOR } from "@@/JSView/config";

const Page: FC = ({}) => {
  const { getText } = useTranslate();

  return (
    <section className={css.page}>
      <Heading
        title={"StateDispatcher"}
        rightBar={
          <div className="flex gap-3 items-center">
            <a href="https://github.com/tterryrice-beep/StateDispatcher">
              <img
                src="https://cdn.simpleicons.org/github/white"
                alt="git"
                className="h-6 w-auto"
              />
            </a>
            <a href="https://www.npmjs.com/package/state-dispatcher-red">
              <img
                src="https://img.shields.io/npm/v/state-dispatcher-red"
                alt="npm version"
              />
            </a>
          </div>
        }
      />
      <div>
        {/* ─────────────────── Для чого ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          {getText("StateDispatcher/reason")}
        </Text>
        <Text>
          {getText("StateDispatcher/discribe", {
            EventEmitter: <Pre inline>EventEmitter</Pre>,
          })}
        </Text>
        <br />
        <br />
        <Text>{getText("StateDispatcher/discribe_2")}</Text>

        {/* ─────────────────── Встановлення ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          {getText("StateDispatcher/install")}
        </Text>
        <Pre>
          <a href="https://www.npmjs.com/package/state-dispatcher-red">
            npm i state-dispatcher-red
          </a>
        </Pre>

        {/* ─────────────────── Концепція ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          {getText("StateDispatcher/concept/title")}
        </Text>
        <Text className="mb-3 block">
          {getText("StateDispatcher/concept/desc")}
        </Text>
        <ObjectView
          defaultExpanded
          data={{
            StateValues: getText("StateDispatcher/concept/state"),
            Events: getText("StateDispatcher/concept/events"),
          }}
        />
        <Text className="mb-3 block mt-6">
          {getText("StateDispatcher/concept/abt", {
            StateValues: <Pre inline>StateValues</Pre>,
            Events: <Pre inline>Events</Pre>,
            Setters: <Pre inline>Setters</Pre>,
          })}
        </Text>
        <JSView>{`
type State = {
  userName: string;
  age: number;
  bornYear: number; // ${getText("StateDispatcher/concept/ex_bornYear")}
};

type Events = {
  userName: string;  // ${getText("StateDispatcher/concept/ex_name")}
  age: { age: number; bornYear: number }; // ${getText("StateDispatcher/concept/ex_age")}
};
`}</JSView>

        {/* ─────────────────── Ініціалізація ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          {getText("StateDispatcher/initial/title")}
        </Text>
        <Text className="mb-3 block">
          {getText("StateDispatcher/initial/desc", {
            StateDispatcher: <Pre inline>StateDispatcher</Pre>,
            super: <Pre inline>super()</Pre>,
          })}
        </Text>
        <JSView>{`
import { StateDispatcher, SetterMap } from "state-dispatcher-red";

type State  = { count: number };
type Events = { count: number };

const INITIAL: State = { count: 0 };

const SETTERS: SetterMap<State, Events> = {
  count(state, value) {
    state.count = value;
  },
};

class CounterManager extends StateDispatcher<State, Events> {
  constructor() {
    super(INITIAL, SETTERS);
  }

  public destroy() {
    this.destroyDispatcher();
  }
}

export const counter = new CounterManager();
`}</JSView>

        <Text className="ml-8 mt-12 mb-6" tag="h3" type="subtitle">
          {getText("StateDispatcher/initial/arguments/title")}
        </Text>
        <ObjectView
          defaultExpanded
          data={{
            initialState: getText(
              "StateDispatcher/initial/arguments/initialState",
            ),
            setters: getText("StateDispatcher/initial/arguments/setters"),
            "config.maxListeners": getText(
              "StateDispatcher/initial/arguments/maxListeners",
            ),
          }}
        />

        {/* ─────────────────── Setters ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          <Pre inline>setters</Pre>
        </Text>
        <Text className="mb-3 block">
          {getText("StateDispatcher/initial/setters/desc", {
            Events: <Pre inline>Events</Pre>,
            manager: <Pre inline>manager</Pre>,
            key: <Pre inline>key</Pre>,
            value: <Pre inline>value</Pre>,
            state: <Pre inline>state</Pre>,
            setter: <Pre inline>{"manager.setters[key](value)"}</Pre>,
          })}
        </Text>
        <Text className="mb-3 block">
          {getText("StateDispatcher/initial/setters/desc_2", {
            undefined: <Pre inline>undefined</Pre>,
            value: <Pre inline>value</Pre>,
          })}
        </Text>
        <JSView>{`
const SETTERS: SetterMap<State, Events> = {
  userName(state, value) {
    state.userName = value;
    // ${getText("StateDispatcher/initial/setters/no_return")}
  },

  age(state, value) {
    state.age = value;
    state.bornYear = new Date().getFullYear() - value;
    // ${getText("StateDispatcher/initial/setters/with_return")}
    return { age: value, bornYear: state.bornYear };
  },
};

// ${getText("StateDispatcher/initial/setters/using/title")}
manager.setters.userName("Alice"); // ${getText("StateDispatcher/initial/setters/using/name", { return: "Alice" })}
manager.setters.age(25); // ${getText("StateDispatcher/initial/setters/using/age", { return: "{ age: 25, bornYear: 2000 }" })}
`}</JSView>

        {/* ─────────────────── listen ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          <Pre inline>listen</Pre>
        </Text>
        <Text className="mb-3 block">
          {getText("StateDispatcher/initial/listen/desc", {
            ex: <Pre inline>{"listen(key, callback)"}</Pre>,
          })}
        </Text>
        <JSView>{`
const unsubscribe = manager.listen("age", ({ age, bornYear }) => {
  console.log(\`Age: \${age}, year of born: \${bornYear}\`);
});

// Відписатися:
unsubscribe();
`}</JSView>

        {/* ─────────────────── getState ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          <Pre inline>getState</Pre>
        </Text>
        <Text className="mb-3 block">
          {getText("StateDispatcher/initial/getState/desc", {
            getState: <Pre inline>getState()</Pre>,
            state: <Pre inline>{"Readonly<StateValues>"}</Pre>,
            readonly: <Pre inline>Readonly</Pre>,
          })}
        </Text>
        <JSView>{`
const state = manager.getState();
console.log(state.count);  // ✓
state.count = 10;           // ✗ TS Error: Cannot assign to read-only property
`}</JSView>
        <Text className="mb-3 block mt-4">
          {getText("StateDispatcher/initial/getState/desc_2", {
            getState: <Pre inline>getState()</Pre>,
          })}
        </Text>
        <JSView>{`
class Ex {
...
  if (this.getState().isLoadingActive) return;
...
}
`}</JSView>

        {/* ─────────────────── destroyDispatcher ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          <Pre inline>destroyDispatcher</Pre>
        </Text>
        <Text className="mb-3 block">
          {getText("StateDispatcher/initial/destroyDispatcher/desc", {
            destroyDispatcher: <Pre inline>destroyDispatcher()</Pre>,
            isDestroyed: <Pre inline>isDestroyed</Pre>,
          })}
        </Text>
        <JSView>{`
class MyManager extends StateDispatcher<State, Events> {
  // ...
  public destroy() {
    this.destroyDispatcher();
  }
}

// ${getText("StateDispatcher/initial/destroyDispatcher/react")}
useEffect(() => {
  return () => manager.destroy();
}, []);
`}</JSView>

        {/* ─────────────────── createHook ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          <Pre inline>createHook</Pre>
        </Text>
        <Text className="mb-3 block">
          {getText("StateDispatcher/initial/createHook/desc", {
            createHook: <Pre inline>createHook</Pre>,
          })}
        </Text>
        <JSView>{`
import { createHook } from "state-dispatcher-red";

export const useCounter = createHook(counter);

// ${getText("StateDispatcher/initial/createHook/in_component")}:
const [count, setCount] = useCounter(
  "count",         //  ${getText("StateDispatcher/initial/createHook/key")}
  (s) => s.count,  //  ${getText("StateDispatcher/initial/createHook/selector")}
);
`}</JSView>

        <Text
          style={{ color: JS_VIEW_COLOR.string }}
          className="mb-3 mt-3 block">
          <span style={{ color: JS_VIEW_COLOR.literal }}>arg 1 -- key:</span>
          {" " + getText("StateDispatcher/initial/createHook/arg_1")}
        </Text>
        <Text className="mb-3 block" style={{ color: JS_VIEW_COLOR.string }}>
          <span style={{ color: JS_VIEW_COLOR.literal }}>
            arg 2 -- selector:
          </span>
          {" " + getText("StateDispatcher/initial/createHook/arg_2")}
        </Text>
        <Text style={{ color: JS_VIEW_COLOR.string }} className="mb-3 block">
          <span style={{ color: JS_VIEW_COLOR.literal }}>
            {getText("StateDispatcher/initial/createHook/tuple_key") + ": "}
          </span>
          {getText("StateDispatcher/initial/createHook/tuple_value")}
        </Text>

        <Text className="mb-3 block mt-6">
          {getText("StateDispatcher/initial/createHook/unmount")}
        </Text>

        {/* ─────────────────── Обмеження ─────────────────── */}
        <Text tag="h2" type="subtitle" className="mt-20 mb-8">
          {getText("StateDispatcher/initial/limits/title")}
        </Text>

        <Text className="ml-8 mt-8 mb-2" tag="h3" type="subtitle">
          {getText("StateDispatcher/initial/limits/abstract")}
        </Text>
        <Text className="mb-3 block">
          {getText("StateDispatcher/initial/limits/disc", {
            abstract: <Pre inline>abstract</Pre>,
          })}
        </Text>

        <Text className="ml-8 mt-6 mb-2" tag="h3" type="subtitle">
          {getText("StateDispatcher/initial/limits/mutate")}
        </Text>
        <Text className="mb-3 block">
          {getText("StateDispatcher/initial/limits/mutate_desc")}
        </Text>

        <Text className="ml-8 mt-6 mb-2" tag="h3" type="subtitle">
          {getText("StateDispatcher/initial/limits/middleware")}
        </Text>
        <Text className="mb-3 block">
          {getText("StateDispatcher/initial/limits/middleware_desc")}
        </Text>

        <Text className="ml-8 mt-6 mb-2" tag="h3" type="subtitle">
          Ліміт слухачів EventEmitter
        </Text>
        <Text className="mb-3 block text-red-500">
          Стандартний ліміт Node.js <Pre inline>EventEmitter</Pre> — 10 слухачів
          на подію. При перевищенні зʼявиться попередження у консолі. Підняти
          ліміт можна через{" "}
          <Pre inline>{"super(initial, setters, { maxListeners: 50 })"}</Pre>.
        </Text>

        <Text className="ml-8 mt-6 mb-2" tag="h3" type="subtitle">
          Не для серверного рендерингу
        </Text>
        <Text className="mb-3 block">
          StateDispatcher використовує <Pre inline>EventEmitter</Pre> з Node.js
          та, при потребі, <Pre inline>localStorage</Pre> у підкласах. Ці API
          недоступні у повноцінному SSR-середовищі.
        </Text>
      </div>
    </section>
  );
};

export default Page;
