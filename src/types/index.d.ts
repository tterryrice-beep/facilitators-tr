import type { FunctionComponent, HTMLAttributes, SVGProps } from "react";

export type NestedKeyOf<ObjectType extends object, StopKey extends string> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? Key extends StopKey
      ? never
      : `${Key}` | `${Key}/${NestedKeyOf<ObjectType[Key], StopKey>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type ObjectAddress<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}/${ObjectAddress<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type ReactSVGType = FunctionComponent<SVGProps<SVGSVGElement>>;
export type ValueOf<T> = T[keyof T];

export type Div = HTMLAttributes<HTMLDivElement>;
