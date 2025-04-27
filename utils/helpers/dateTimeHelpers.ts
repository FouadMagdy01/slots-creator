import { getCalendars } from "expo-localization";
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

export const createDateTime = (date: string, time: string): Date => {
  const now = new Date();

  if (!date && !time) {
    return now;
  }

  let finalDate = date ? new Date(date) : new Date();

  if (date && !time) {
    // If time is empty, set the time to now's time
    finalDate.setHours(
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    );
    return finalDate;
  }

  if (!date && time) {
    // If date is empty, set today’s date and passed time
    const [hours, minutes] = time.split(":").map(Number);
    finalDate.setHours(hours, minutes, 0, 0);
    return finalDate;
  }

  if (date && time) {
    // If both date and time are provided
    const [hours, minutes] = time.split(":").map(Number);
    finalDate.setHours(hours, minutes, 0, 0);
    return finalDate;
  }

  return now; // fallback, though code won't usually reach here
};

export const getCurrentTimezone = (): TimezoneInfoItem => {
  const deviceTimezone = getCalendars()[0].timeZone ?? moment.tz.guess();
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
