import { toCamelCase } from 'remeda';

export function formatProps<P extends {}>(props: P): P {
  const formattedProps: Record<string, any> = {};

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null) {
      continue;
    }

    switch (key) {
      case 'onTimeredCounterAnimationStart':
      case 'onTimeredCounterAnimationEnd':
        // @ts-ignore
        formattedProps[toCamelCase(key)] = props[key];
        break;
      default:
        // @ts-ignore
        formattedProps[`.${toCamelCase(key)}`] = props[key];
        break;
    }
  }

  return formattedProps as P;
}
