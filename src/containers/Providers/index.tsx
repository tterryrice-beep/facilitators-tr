import type { FC } from "react";
import { RouterProvider } from "../Router";

interface Props {
  children?: React.ReactNode;
}
export const Providers: FC<Props> = ({ children }) => {
  return (
    <>
      <RouterProvider>{children}</RouterProvider>
    </>
  );
};
