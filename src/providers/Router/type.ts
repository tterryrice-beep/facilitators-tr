import type { config, getModal, getPath } from "./PathProvider";

export type PathConfig = typeof config;

export type ModalPath = ReturnType<typeof getModal>;
export type PagePath = ReturnType<typeof getPath>;
