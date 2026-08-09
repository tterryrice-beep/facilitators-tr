export type InterpolateResult<Values extends Record<string, unknown>> =
  Values extends Record<string, string>
    ? string
    : Array<string | Values[keyof Values]>;

export const interpolate = <
  Values extends Record<string, unknown> = Record<string, string>,
>(
  template: string,
  values?: Values,
): InterpolateResult<Values> => {
  if (!values) {
    return template as InterpolateResult<Values>;
  }

  const parts = template.split(/(\{[^}]+\})/g);

  let isArray = false;

  const result = parts.map((part) => {
    const match = part.match(/^\{([^}]+)\}$/);

    if (!match) {
      return part;
    }

    const value = values[match[1] as keyof Values];

    if (value === undefined) {
      return part;
    }

    if (typeof value !== "string") {
      isArray = true;
    }

    return value;
  });

  return isArray
    ? (result as InterpolateResult<Values>)
    : (result.join("") as InterpolateResult<Values>);
};
