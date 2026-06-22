import type { FC } from "react";
import type { ErrorFallbackProps } from "./type";

export const DefaultErrorScreen: FC<ErrorFallbackProps> = ({
  error,
  reset,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-bold">{error.name}</h1>
      <button className="btn btn-primary" onClick={reset}>
        Try again
      </button>
      <hr />
      <p className="text-lg">{error.message}</p>
      <hr />
      <pre className="text-sm">{error.stack}</pre>
    </div>
  );
};
