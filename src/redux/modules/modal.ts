import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CancelCallModalData,
  SendAlertModalData,
  InactiveModalData,
  CancelConnectionModalData,
} from "src/typings/Modal";

type ModalEntity =
  | InactiveModalData
  | CancelCallModalData
  | CancelConnectionModalData
  | SendAlertModalData;

type ModalsSliceState = { data: ModalEntity };

const initialState: ModalsSliceState = {
  data: { activeType: "INACTIVE_MODAL", entity: null },
};

export const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ModalEntity>) => {
      state.data = action.payload;
    },
    closeModal: (state) => {
      state.data = { activeType: "INACTIVE_MODAL", entity: null };
    },
  },
});

export const { openModal, closeModal } = modalsSlice.actions;
