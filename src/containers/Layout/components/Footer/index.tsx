import { CopyText } from "@@/CopyText";
import { Text } from "@@/Text";
import React, { type FC } from "react";

interface Props {
  children?: React.ReactNode;
}
export const Footer: FC<Props> = ({}) => {
  return (
    <footer className="bg-mist-900 border-t-2 border-mist-800 py-6 px-6">
      <div className="flex flex-row items-center justify-between mx-auto max-w-6xl">
        <div>
          <Text type="small" className="text-xs block">
            Built and maintained by
          </Text>
          <Text type="small" className="text-xs block">
            W. Tkachenko. © {new Date().getFullYear()}
          </Text>
        </div>
        <div>
          <CopyText type="small" className="text-xs">
            t.terry.rice@gmail.com
          </CopyText>
        </div>
      </div>
    </footer>
  );
};
