import { LocaleProvider } from "@/providers/LocaleProvider";
import { RouterProvider } from "@/providers/Router";
import { Fragment, type FC } from "react";

interface Props {
  children?: React.ReactNode;
}
export const Providers: FC<Props> = ({ children }) => {
  return (
    <>
      <LocaleProvider>
        <RouterProvider>
          <Fragment>{children}</Fragment>
        </RouterProvider>
      </LocaleProvider>
    </>
  );
};
