import { SlotCreationValues } from "@/components/forms/slotsForm/schemes";
import { MMKV } from "react-native-mmkv";
import { GeneratedSlotsType } from "../soltsHelpers/slotsGenerationHelpers";

export const storage = new MMKV();

export const MMKV_KYS = {
  SLOTS: "@SLOTS",
};

export type Slot = SlotCreationValues & {
  uid: string;
};
export class MMKVUtils {
  static getSlots(): GeneratedSlotsType {
    const localSlots = storage.getString(MMKV_KYS.SLOTS);
    return (localSlots ? JSON.parse(localSlots) : {}) as GeneratedSlotsType;
  }

  static addGeneratedSlots(generatedSlots: GeneratedSlotsType) {
    const localSlots = this.getSlots();
    const updatedSlots: GeneratedSlotsType = {
      ...localSlots,
      ...generatedSlots,
    };
    storage.set(MMKV_KYS.SLOTS, JSON.stringify(updatedSlots));
    return updatedSlots;
  }

  static deleteSlot(slotUid: string): GeneratedSlotsType {
    const localSlots = this.getSlots();
    const updatedSlots: GeneratedSlotsType = { ...localSlots };

    for (const [dayKey, daySlots] of Object.entries(localSlots)) {
      const slotIndex = daySlots.findIndex((slot) => slot.uid === slotUid);

      if (slotIndex !== -1) {
        const updatedDaySlots = [...daySlots];
        updatedDaySlots.splice(slotIndex, 1);

        if (updatedDaySlots.length > 0) {
          updatedSlots[dayKey] = updatedDaySlots;
        } else {
          delete updatedSlots[dayKey];
        }

        break;
      }
    }

    storage.set(MMKV_KYS.SLOTS, JSON.stringify(updatedSlots));
    return updatedSlots;
  }
}
