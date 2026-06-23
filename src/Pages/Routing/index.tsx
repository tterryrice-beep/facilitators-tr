import React, { type FC } from "react";

import { useTranslate } from "@/providers/LocaleProvider/hook";

import { ObjectView } from "@@/ObjectView";
import { Heading } from "@@/Heading";
import { JSXView } from "@@/JSXView";
import { Text } from "@@/Text";

import css from "./style.module.scss";

// const { modals, pages } = createRoute(route);

const Page: FC = ({}) => {
  const { getText, changeLanguage } = useTranslate();

  return (
    <div className={css.page}>
      <Heading title={"Routing"} rightBar={<div>github ling be here</div>} />

      <section id={css.overview} className="mt-6">
        <Text type="subtitle">Проблематика</Text>
        <br />
        <br />
        <Text>
          На багатьох проектах де я працював часто були проблеми зі Зручністю
          маршрутизації.
          <br />В кращому разі, вона виглядала ось так:
        </Text>

        <div className="mb-6 mt-6 ">
          <ObjectView
            defaultExpanded
            data={{
              routes: [
                {
                  path: "/about",
                  element: "<AboutRoot />",
                },
                {
                  path: "/about/terms",
                  element: "<Terms />",
                },
                {
                  path: "/about/privacy",
                  element: "<Privacy />",
                },
              ],
            }}
          />

          <JSXView>{`
<Routes>
  {routes.map((data) => <Route {...data} />)}
</Routes>`}</JSXView>
        </div>

        <Text>
          Але зазвичай воно реалізовано як у типових Реакт-посібниках:
        </Text>

        <JSXView>{`
<Routes>
  <Route path="/about" element={<AboutRoot />} />
  <Route path="/about/terms" element={<Terms />} />
  <Route path="/about/privacy" element={<Privacy />} />
  ...
</Routes>`}</JSXView>
        <br />
        <br />

        <Text>Які проблеми із цього, виникали особисто у мене:</Text>
        <ul className="list-disc mt-4">
          <li className="ml-8">
            <Text>
              Додавання нових сторінок, чи, прости Господи, переадресація.
            </Text>
          </li>

          <li className="ml-8">
            <Text>Робота із посиланнями та переходами між сторінками.</Text>
            <br />
            <Text>
              Щастить, коли всі маршрути зберігаються у документації, чи хоча би
              в енумі. Але на практиці, доводиться залазити у файл, та шукати,
              потрібний шлях.
            </Text>
          </li>

          <li className="ml-8">
            <Text>Модалки.</Text>
            <br />
            <Text>
              Є ситуації коли для модалок прописують окремий маршрут типу:
            </Text>
            <br />
            <ObjectView
              defaultExpanded
              data={{
                routes: [
                  {
                    path: "/about",
                    element: "<About />",
                  },
                  {
                    path: "/about/modal",
                    element: "<About />",
                  },
                ],
              }}
            />
            <br />
            <Text>І це навіть не перебільшення</Text>
          </li>
        </ul>
        <br />
        <Text>
          Тож, зрештою, я написав власне рішення, котре особисто мене би
          влаштовувало
        </Text>
      </section>

      <section id={css.about}>
        <Text type="subtitle">Для чого взагалі існує PathRouter</Text>
        <br />
        <br />

        <Text>
              В багатьох проектах над якими я працював підозріло часто траплялися проблеми із типізацією маршрутів. 
        </Text>

      </section>
    </div>
  );
};

export default Page;
