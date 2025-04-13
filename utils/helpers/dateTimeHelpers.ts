import moment from "moment-timezone";

export const getTimeZones = () => {
  const timezones = moment.tz.names();

  const timezoneOffsets = timezones.map((tz) => {
    const now = moment.tz(tz);
    const offsetInMinutes = now.utcOffset();
    const offsetHours = offsetInMinutes / 60;
    const formattedOffset = `UTC${offsetHours >= 0 ? "+" : ""}${offsetHours}`;

    return {
      timezone: tz,
      offset: formattedOffset,
    };
  });

  timezoneOffsets.sort((a, b) => a.timezone.localeCompare(b.timezone));
  return timezoneOffsets;
};

export type TimezoneInfo = ReturnType<typeof getTimeZones>;
export type TimezoneInfoItem = TimezoneInfo[number];

export const createISOString = (
  dateStr: string,
  timeStr: string,
  timezone: string
): string => {
  return moment
    .tz(`${dateStr} ${timeStr}`, "YYYY-MM-DD HH:mm", timezone)
    .toISOString();
};

export const getCurrentTimezone = (): TimezoneInfoItem => {
  const deviceTimezone = moment.tz.guess();
  const now = moment.tz(deviceTimezone);
  const offsetInMinutes = now.utcOffset();
  const offsetHours = offsetInMinutes / 60;
  const formattedOffset = `UTC${offsetHours >= 0 ? "+" : ""}${offsetHours}`;
  return {
    timezone: deviceTimezone,
    offset: formattedOffset,
  };
};

export function isValidTimeZone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch (e) {
    return false;
  }
}
