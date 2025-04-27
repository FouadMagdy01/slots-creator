import { SlotCreationValues } from "@/components/forms/slotsForm/schemes";
import { Slot, MMKVUtils } from "@/utils/helpers/mmkvHelpers";
import { GroupedSlotsType } from "@/utils/soltsHelpers/slotsGenerationHelpers";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

type SlotsStateTypes = {
  slots: GroupedSlotsType;
};

const initialState: SlotsStateTypes = {
  slots: MMKVUtils.getSlots(),
};

const slotsSlice = createSlice({
  name: "slots",
  initialState: initialState,
  reducers: {
    addGeneratedSlots: (state, action: PayloadAction<GroupedSlotsType>) => {
      // Merge the new slots with existing ones
      state.slots = { ...state.slots, ...action.payload };
      // Update storage
      MMKVUtils.addGeneratedSlots(action.payload);
    },

    deleteSlot: (state, action: PayloadAction<{ slotUid: string }>) => {
      const { slotUid } = action.payload;

      // Find the day containing this slot
      for (const dayKey of Object.keys(state.slots)) {
        const slotIndex = state.slots[dayKey].findIndex(
          (slot) => slot.uid === slotUid
        );
        if (slotIndex !== -1) {
          // Remove the slot
          state.slots[dayKey].splice(slotIndex, 1);

          // Remove the day if it's empty
          if (state.slots[dayKey].length === 0) {
            delete state.slots[dayKey];
          }

          // Update storage
          MMKVUtils.deleteSlot(slotUid);
          break;
        }
      }
    },
  },
});

export const { addGeneratedSlots, deleteSlot } = slotsSlice.actions;
export default slotsSlice.reducer;
