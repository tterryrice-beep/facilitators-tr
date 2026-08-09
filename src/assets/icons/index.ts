import { clothes } from "./clothes";
import { seasons } from "./seasons";
import { weather } from "./weather";
import { main } from "./main";

export const allIcons = {
  clothes,
  main,
  seasons,
  weather,
} as const;

export type IconsRoot = typeof allIcons;
export type IconCategory = keyof IconsRoot;

type ClothesIcon = typeof allIcons.clothes;
type MainIcon = typeof allIcons.main;
type SeasonsIcon = typeof allIcons.seasons;
type WeatherIcon = typeof allIcons.weather;

type ClothesElements = keyof ClothesIcon;
type MainElements = keyof MainIcon;
type SeasonsElements = keyof SeasonsIcon;
type WeatherElements = keyof WeatherIcon;

type ClothesNames = `clothes/${ClothesElements}`;
type MainNames = `main/${MainElements}`;
type SeasonsNames = `seasons/${SeasonsElements}`;
type WeatherNames = `weather/${WeatherElements}`;

export type IconElement =
  | ClothesElements
  | MainElements
  | SeasonsElements
  | WeatherElements;

export type IconInstance = ClothesIcon["Cloting"];

// export type IconName = MainNames | ClothesNames | SeasonsNames | WeatherNames;
export type IconName = MainNames;
