import { getCurrentTimezone } from "@/utils/helpers/dateTimeHelpers";
import moment from "moment-timezone";
import * as Yup from "yup";

const isValidDate = (value: string | undefined): boolean => {
  if (!value) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
};

export const slotCreationSchema = Yup.object().shape({
  startDate: Yup.string()
    .required("Start date is required")
    .test("valid-date", "Start date must be a valid date string", isValidDate),

  endDate: Yup.string()
    .required("End date is required")
    .test("valid-date", "End date must be a valid date string", isValidDate)
    .test(
      "is-after-start-date",
      "End date must be equal to or after start date",
      function (endDate) {
        const { timezone } = getCurrentTimezone();
        const { startDate } = this.parent;
        if (!startDate || !endDate) return true;
        const endDateObj = moment.tz(endDate, timezone);
        const startDateObj = moment.tz(startDate, timezone);
        // Check if end date is same as or after start date
        return endDateObj.isSameOrAfter(startDateObj);
      }
    ),

  startTime: Yup.string()
    .required("Start time is required")
    .matches(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Start time must be in HH:mm format"
    ),

  endTime: Yup.string()
    .required("End time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "End time must be in HH:mm format")
    .test(
      "is-valid-end-time",
      "End time must be after start time and allow for at least one slot duration",
      function (endTime?: string): boolean {
        const { startTime, startDate, endDate, slotDuration } = this.parent as {
          startTime: string;
          startDate: string;
          endDate: string;
          slotDuration: string;
        };

        if (!startTime || !endTime || !startDate || !endDate || !slotDuration)
          return true;

        const { timezone } = getCurrentTimezone();

        const startDateTime = moment.tz(`${startDate}T${startTime}`, timezone);
        const endDateTime = moment.tz(`${endDate}T${endTime}`, timezone);

        // 1. End datetime must be after start datetime
        if (!endDateTime.isAfter(startDateTime)) {
          return false;
        }

        // 2. Time part: ensure end time is after start time
        const [startHours, startMinutes] = startTime.split(":").map(Number);
        const [endHours, endMinutes] = endTime.split(":").map(Number);

        if (
          endHours < startHours ||
          (endHours === startHours && endMinutes <= startMinutes)
        ) {
          return false;
        }

        // 3. Check slot duration fits
        const slotDurationMinutes = parseInt(slotDuration, 10);

        // Add slot duration to start datetime
        const minimumEndDateTime = startDateTime
          .clone()
          .add(slotDurationMinutes, "minutes");

        // There must be enough time for at least one slot
        if (!endDateTime.isSameOrAfter(minimumEndDateTime)) {
          return false;
        }

        return true;
      }
    ),

  timeZone: Yup.string()
    .required("Timezone is required")
    .test("valid-timezone", "Invalid time zone identifier", (value) => {
      try {
        if (!value) return false;
        Intl.DateTimeFormat(undefined, { timeZone: value });
        return true;
      } catch (error) {
        return false;
      }
    }),

  breakDuration: Yup.string()
    .matches(/^[1-9]\d*$/, "Must be a positive integer")
    .required("Break duration is required"),

  slotDuration: Yup.string()
    .matches(/^[1-9]\d*$/, "Must be a positive integer")
    .required("Slot duration is required"),

  bufferDuration: Yup.string()
    .matches(/^[1-9]\d*$/, "Must be a positive integer")
    .required("Buffer duration is required"),
});

export type SlotCreationValues = Yup.InferType<typeof slotCreationSchema>;
