import type { FC } from "react";
import { PathProvider } from "~/modules";

interface Props {
  children?: React.ReactNode;
}
export const Providers: FC<Props> = ({ children }) => {
  return (
    <>
      <PathProvider>{children}</PathProvider>
    </>
  );
};
