import React, { type FC } from "react";

interface Props {
  children?: React.ReactNode;
}
export const Footer: FC<Props> = ({}) => {
  return (
    <footer className="bg-mist-900 border-t-2 border-mist-800 py-4 px-6">
      <div className="flex flex-row items-center justify-between mx-auto max-w-6xl">
        <div>Footer</div>
        <div>Copyright</div>
      </div>
    </footer>
  );
};
