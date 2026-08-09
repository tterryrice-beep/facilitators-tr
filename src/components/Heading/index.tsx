import { Text } from "@@/Text";
import type { FC, ReactNode } from "react";

interface Props {
  title: string;
  rightBar?: ReactNode;
}
export const Heading: FC<Props> = ({ title, rightBar }) => {
  return (
    <>
      <div className="flex justify-between w-full mt-4 mb-4">
        <Text type="title" tag="h1">
          {title}
        </Text>
        <div>{rightBar}</div>
      </div>

      <hr className="border-gray-700 mb-6 " />
    </>
  );
};
