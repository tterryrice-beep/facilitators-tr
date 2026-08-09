import React, { type FC } from "react";

interface Props {
  children?: React.ReactNode;
  minWidth?: number;
}

export const ScrollBox: FC<Props> = ({ children, minWidth = 380 }) => {
  return (
    <>
      <div className="overflow-hidden w-full">
        <div className="w-full overflow-auto">
          <div
            style={{
              minWidth,
            }}
            className={"w-full"}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
