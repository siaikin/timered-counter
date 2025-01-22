export const DateTimeFields = [
  "era",
  "year",
  "quarter",
  "month",
  "weekOfYear",
  "weekday",
  "day",
  "dayPeriod",
  "hour",
  "minute",
  "second",
  "timeZoneName",
] as const;

export function getLocalizedDateTimeFields(locale: Intl.Locale) {
  const displayNames = new Intl.DisplayNames(locale, {
    type: "dateTimeField",
  });

  return DateTimeFields.reduce(
    (acc, field) => {
      acc[field] = displayNames.of(field) ?? "";
      return acc;
    },
    {} as Record<(typeof DateTimeFields)[number] | string, string>
  );
}
