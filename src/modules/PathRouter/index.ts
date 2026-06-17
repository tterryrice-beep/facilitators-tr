/**
 * Router package — public API.
 *
 * Quick start:
 *
 * ```tsx
 * // 1. Build a config
 * import { setPage, setModal } from "@/Router";
 * export const config = {
 *   pages: {
 *     "/":   setPage({ component: HomePage }),
 *     add:   setPage({ component: AddItemPage }),
 *     "*":   setPage({ component: NotFoundPage }),
 *   },
 *   modals: {
 *     test: setModal({ component: TestModal }),
 *   },
 * } as const;
 *
 * // 2. Mount it
 * import { PathProvider, RouterContainer } from "@/Router";
 * <PathProvider>
 *   <RouterContainer config={config} ModalWrapper={MyModalWrapper} />
 * </PathProvider>
 *
 * // 3. Read it (typed)
 * import { usePath } from "@/Router";
 * const { page, modal } = usePath<typeof config>();
 * page.navigate("add");   // ✓ typed
 * modal.open("test");     // ✓ typed
 * ```
 */

/* Main user-facing pieces */
export { PathRouterContainer } from "./Container";
export type { PathRouterProps } from "./Container/RouterContainer";

export { PathProvider, usePath } from "./Provider";

export { NavLink } from "./NavLink";
export type { NavLinkProps } from "./NavLink";

export { setPage, setModal } from "./utils/setters";

/* Useful path helpers */
export { clearSlash } from "./utils/clearSlash";

/* All public types */
export type {
  RouterConfig,
  PathNamesOf,
  ModalNamesOf,
  PageData,
  ModalData,
  ModalProps,
  PagesRoute,
  ModalRoutes,
  ExtendedPage,
  PathContextType,
  ModalState,
  SearchParams,
  SearchParamsState,
  ModalWrapperComponent,
  ModalWrapperProps,
  ModalWrapperRef,
} from "./types";
