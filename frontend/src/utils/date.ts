export function formatDate(
  value: string,
): string {
  const date = new Date(
    `${value.slice(0, 10)}T00:00:00`,
  );

  return new Intl.DateTimeFormat(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  ).format(date);
}

export function getTodayDateInput(): string {
  const now = new Date();
  const timezoneOffset =
    now.getTimezoneOffset() * 60_000;

  return new Date(
    now.getTime() - timezoneOffset,
  )
    .toISOString()
    .slice(0, 10);
}
