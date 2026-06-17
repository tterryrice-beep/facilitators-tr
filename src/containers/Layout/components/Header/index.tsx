import { LogoTR } from "@@/LogoTR";
import type { FC } from "react";

export const Header: FC = () => {
  return (
    <header className="flex gap-3 flex-row items-center justify-between py-4 px-6 bg-mist-800 border-b-2 border-mist-600">
      <div>
        <LogoTR />
      </div>
      <div>Navigation</div>
    </header>
  );
};
