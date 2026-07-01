import { route } from "@/config";
import { createPathRouter } from "@/modules/PathRouter";

export const {
  NavLink,
  PathProvider,
  PagesContainer,
  getModal,
  getPath,
  config,
  usePath,
} = createPathRouter(route);
