import { route } from "@/config";
import { createPathRouter } from "@/modules";

export const {
  NavLink,
  PathProvider,
  PathRouterContainer,
  getModal,
  getPath,
  usePath,
} = createPathRouter(route);
