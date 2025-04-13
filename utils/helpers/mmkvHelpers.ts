import { SlotCreationValues } from "@/components/forms/slotsForm/schemes";
import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

export const MMKV_KYS = {
  SLOTS: "@SLOTS",
};

export type Slot = SlotCreationValues & {
  ui: string;
};
export class MMKVUtils {
  static getSlots(): Slot[] {
    const localSlots = storage.getString(MMKV_KYS.SLOTS);
    console.log(JSON.parse(localSlots));
    return (localSlots ? JSON.parse(localSlots) : []) as Slot[];
  }

  static addSlot(newSlot: Slot) {
    const localSlots = this.getSlots();
    const updatedSlots: Slot[] = [...localSlots, { ...newSlot }];
    storage.set(MMKV_KYS.SLOTS, JSON.stringify(updatedSlots));
    console.log("added");
    return updatedSlots;
  }
  static editSlot(updatedSlot: Slot): Slot[] {
    const localSlots = this.getSlots();
    const updatedSlots = localSlots.map((slot) =>
      slot.uid === updatedSlot.uid ? updatedSlot : slot
    );
    storage.set(MMKV_KYS.SLOTS, JSON.stringify(updatedSlots));
    return updatedSlots;
  }
  static deleteSlot(slotUid: string): Slot[] {
    const localSlots = this.getSlots();
    const updatedSlots = localSlots.filter((slot) => slot.uid != slotUid);
    storage.set(MMKV_KYS.SLOTS, JSON.stringify(updatedSlots));
    return updatedSlots;
  }
}
