import React, { type FC } from 'react';
import BoardCanvas from './components/cardboard/BoardCanvas';
import css from './style.module.scss';

const Page: FC = () => {
  return (
    <section className={css.page}>
      <BoardCanvas />
    </section>
  );
};

export default Page;
