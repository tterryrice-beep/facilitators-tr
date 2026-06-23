import { Text } from "@@/Text";
import type { FC, ReactNode } from "react";

interface Props {
  title: string;
  rightBar?: ReactNode;
}
export const Heading: FC<Props> = ({ title, rightBar }) => {
  return (
    <>
      <div className="flex justify-between w-full">
        <Text type="title">{title}</Text>
        <div>{rightBar}</div>
      </div>
    </>
  );
};
