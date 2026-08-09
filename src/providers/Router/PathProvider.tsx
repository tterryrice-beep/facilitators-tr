import { createPathRouter } from "path-router-red";
import { route } from "@/config";

export const {
  NavLink,
  PathProvider,
  PagesContainer,
  getModal,
  getPath,
  config,
  usePath,
} = createPathRouter(route);
