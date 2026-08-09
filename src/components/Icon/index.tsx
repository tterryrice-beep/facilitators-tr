import React, { type FC, Fragment, useMemo } from "react";

import {
  allIcons,
  type IconCategory,
  type IconInstance,
  type IconElement,
  type IconName,
} from "@/assets/icons";
import Alert from "@/assets/icons/alert.svg?react";

type SVGProps = React.SVGProps<SVGSVGElement>;
interface Props {
  name: IconName;

  props?: SVGProps;
}

export const Icon: FC<Props> = ({ name, props }) => {
  const CurrentIcon = useMemo(() => {
    try {
      const [category, iconName] = name.split("/") as [
        IconCategory,
        IconElement,
      ];
      const categoryList = allIcons[category];
      //@ts-ignore
      const Icon = categoryList[iconName];
      return Icon as IconInstance;
    } catch (error) {
      return Alert;
    }
  }, [name]);

  return (
    <Fragment key={name}>
      <CurrentIcon {...props} />
    </Fragment>
  );
};
