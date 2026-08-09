import { useEffect, useState } from "react";
import type { StateDispatcher } from "../Manager";

export const createHook = <StateValues, Events extends Record<string, any>>(
  manager: StateDispatcher<StateValues, Events>,
) => {
  return <K extends keyof Events>(
    key: K,
    selector: (state: StateValues) => Events[K],
  ) => {
    const [value, setValue] = useState(() => selector(manager.getState()));

    useEffect(() => {
      const rm = manager.listen(key, () => {
        setValue(selector(manager.getState()));
      });

      return rm;
    }, [manager, key]);

    return [value, manager.setters[key]] as const;
  };
};
