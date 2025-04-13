import { SlotCreationValues } from "@/components/forms/slotsForm/schemes";
import { Slot, MMKVUtils } from "@/utils/helpers/mmkvHelpers";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { v4 as uuidv4 } from "uuid";

type SlotsStateTypes = {
  slots: Slot[];
};
const initialState: SlotsStateTypes = {
  slots: MMKVUtils.getSlots(),
};

const slotsSlice = createSlice({
  name: "slots",
  initialState: initialState,
  reducers: {
    addSlot: (state, action: PayloadAction<SlotCreationValues>) => {
      const newSlotUid = uuidv4();
      state.slots.push({ ...action.payload, uid: newSlotUid });
      MMKVUtils.addSlot({ ...action.payload, uid: newSlotUid });
    },
    editSlot: (state, action: PayloadAction<Slot>) => {
      const index = state.slots.findIndex(
        (slot) => slot.uid === action.payload.uid
      );
      if (index !== -1) {
        state.slots[index] = action.payload;
        MMKVUtils.editSlot(action.payload);
      }
    },
    deleteSlot: (state, action: PayloadAction<{ slotUid: string }>) => {
      state.slots = state.slots.filter(
        (slot) => slot.uid !== action.payload.slotUid
      );
      MMKVUtils.deleteSlot(action.payload.slotUid);
    },
  },
});

export const { addSlot, editSlot, deleteSlot } = slotsSlice.actions;
export default slotsSlice.reducer;
