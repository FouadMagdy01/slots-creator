import { SlotCreationValues } from "@/components/forms/slotsForm/schemes";
import { Slot } from "../helpers/mmkvHelpers";
import moment from "moment-timezone";
import { v4 as uuidv4 } from "uuid";

export type GroupedSlotsType = Record<string, Slot[]>;
export const generateSlotsFromSlotsForm = (
  values: SlotCreationValues
): GroupedSlotsType => {
  const slotsByDay: GroupedSlotsType = {};

  const slotDuration = parseInt(values.slotDuration);
  const breakDuration = parseInt(values.breakDuration);
  const timezone = values.timeZone;

  const startDateTimeStr = `${values.startDate} ${values.startTime}`;
  const endDateTimeStr = `${values.endDate} ${values.endTime}`;
  const startDate = moment.tz(startDateTimeStr, "YYYY-MM-DD HH:mm", timezone);
  const endDate = moment.tz(endDateTimeStr, "YYYY-MM-DD HH:mm", timezone);

  const numOfDays = endDate.diff(startDate, "days");

  for (let day = 0; day <= numOfDays; day++) {
    const dayStart = startDate.clone().add(day, "days").set({
      hour: startDate.hour(),
      minute: startDate.minute(),
      second: 0,
      millisecond: 0,
    });

    const dayEnd = startDate.clone().add(day, "days").set({
      hour: endDate.hour(),
      minute: endDate.minute(),
      second: 0,
      millisecond: 0,
    });

    const dayKey = uuidv4(); // Using UUID for each day's key
    const slotsForDay: Slot[] = [];

    let currentSlotStart = dayStart.clone();

    while (true) {
      const currentSlotEnd = currentSlotStart
        .clone()
        .add(slotDuration, "minutes");

      if (currentSlotEnd.isAfter(dayEnd)) {
        break;
      }

      const newSlot: Slot = {
        uid: uuidv4(),
        startDate: currentSlotStart.format("YYYY-MM-DD"),
        endDate: currentSlotEnd.format("YYYY-MM-DD"),
        startTime: currentSlotStart.format("HH:mm"),
        endTime: currentSlotEnd.format("HH:mm"),
        timeZone: timezone,
        slotDuration: values.slotDuration,
        breakDuration: values.breakDuration,
        bufferDuration: values.bufferDuration,
      };

      slotsForDay.push(newSlot);

      const nextSlotStart = currentSlotEnd
        .clone()
        .add(breakDuration, "minutes");
      if (nextSlotStart.isAfter(dayEnd)) {
        break;
      }

      currentSlotStart = nextSlotStart;
    }

    if (slotsForDay.length > 0) {
      slotsByDay[dayKey] = slotsForDay;
    }
  }

  return slotsByDay;
};

export const filterSlotsByRange = (
  slotsByDay: GroupedSlotsType,
  startRangeStr: string,
  endRangeStr: string,
  timezone: string
): GroupedSlotsType => {
  const filteredSlotsByDay: GroupedSlotsType = {};

  // Safety check for timezone
  const safeTimezone = timezone || "UTC";
  const now = moment.tz(safeTimezone);

  // Handle empty strings explicitly
  let startRange;
  if (startRangeStr && startRangeStr.trim() !== "") {
    startRange = moment.tz(startRangeStr, "YYYY-MM-DD HH:mm", safeTimezone);
    if (!startRange.isValid()) {
      startRange = now.clone();
    }
  } else {
    startRange = now.clone();
  }

  // Handle empty strings explicitly for end range
  let endRange = null; // Default to null (no upper limit)
  if (endRangeStr && endRangeStr.trim() !== "") {
    endRange = moment.tz(endRangeStr, "YYYY-MM-DD HH:mm", safeTimezone);
    if (!endRange.isValid() || endRange.isBefore(startRange)) {
      endRange = startRange.clone().add(7, "days");
    }
  }

  // Ensure startRange is not before now
  if (startRange.isBefore(now)) {
    startRange = now.clone();
  }

  Object.entries(slotsByDay).forEach(([dayKey, slots]) => {
    const filteredSlots = slots.filter((slot) => {
      // Ensure we have valid parameters for creating moment
      if (!slot.startDate || !slot.startTime || !slot.timeZone) {
        return false;
      }

      try {
        const slotStart = moment.tz(
          `${slot.startDate} ${slot.startTime}`,
          "YYYY-MM-DD HH:mm",
          slot.timeZone
        );

        if (!slotStart.isValid()) {
          return false;
        }

        if (endRange) {
          return slotStart.isBetween(startRange, endRange, undefined, "[]"); // inclusive
        } else {
          return slotStart.isSameOrAfter(startRange); // no end limit
        }
      } catch (error) {
        // Handle any unexpected errors
        console.warn("Error processing slot:", error);
        return false;
      }
    });

    if (filteredSlots.length > 0) {
      filteredSlotsByDay[dayKey] = filteredSlots;
    }
  });

  return filteredSlotsByDay;
};

export const groupSlotsByDate = (slots: Slot[]): GroupedSlotsType => {
  const groupedByDate: GroupedSlotsType = {};

  slots.forEach((slot) => {
    const dateKey = moment
      .tz(
        `${slot.startDate} ${slot.startTime}`,
        "YYYY-MM-DD HH:mm",
        slot.timeZone
      )
      .format("YYYY-MM-DD");

    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }
    groupedByDate[dateKey].push(slot);
  });

  return groupedByDate;
};

export const flattenSlots = (slots: GroupedSlotsType): Slot[] => {
  const flatSlots: Slot[] = [];
  // Check if slots is defined and is an object
  if (slots && typeof slots === "object") {
    // Safely iterate through the object
    Object.keys(slots).forEach((dayKey) => {
      const daySlots = slots[dayKey];
      if (Array.isArray(daySlots)) {
        flatSlots.push(...daySlots);
      }
    });
  }

  return flatSlots;
};
