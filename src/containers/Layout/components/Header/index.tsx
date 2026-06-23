import { LogoTR } from "@@/LogoTR";
import type { FC } from "react";

export const Header: FC = () => {
  return (
    <header className=" bg-mist-800 border-b-2 border-mist-600 ">
      <div className="mx-auto flex gap-3 flex-row items-center justify-between py-4 px-6 max-w-6xl">
        <div>
          <LogoTR />
        </div>
        <div>Navigation</div>
      </div>
    </header>
  );
};
