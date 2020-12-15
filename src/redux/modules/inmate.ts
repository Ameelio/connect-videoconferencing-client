// const SET_INMATES = "inmate/SET_INMATES";
// const SELECT_INMATE = "inmate/SELECT_INMATE";

// // Action Constants & Shapes
// interface SetInmatesAction {
//   type: typeof SET_INMATES;
//   payload: Inmate[];
// }

// interface SelectInmateAction {
//   type: typeof SELECT_INMATE;
//   payload: Inmate;
// }

// type InmateActionTypes = SetInmatesAction | SelectInmateAction;

// // Action Creators
// export const setInmates = (inmates: Inmate[]): InmateActionTypes => {
//   return {
//     type: SET_INMATES,
//     payload: inmates,
//   };
// };

// export const selectInmate = (inmate: Inmate): InmateActionTypes => {
//   return {
//     type: SELECT_INMATE,
//     payload: inmate,
//   };
// };

// // Reducer
// const initialState: InmateState = {
//   inmates: [],
//   selectedInmate: null,
// };

// export function inmatesReducer(
//   state = initialState,
//   action: InmateActionTypes
// ): InmateState {
//   switch (action.type) {
//     case SET_INMATES:
//       const selectedInmate = action.payload.length ? action.payload[0] : null;
//       return {
//         ...state,
//         inmates: action.payload,
//         selectedInmate: selectedInmate,
//       };
//     case SELECT_INMATE:
//       return { ...state, selectedInmate: action.payload };
//     default:
//       return state;
//   }
// }

import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";

// The magic line

export const inmatesAdapter = createEntityAdapter<Inmate>();

export const inmatesSlice = createSlice({
  name: "inmates",
  initialState: inmatesAdapter.getInitialState(),
  reducers: {
    inmatesAddMany: inmatesAdapter.addMany,
    inmatesUpdate: inmatesAdapter.updateOne,
    // selectInmate: (state, action: PayloadAction<Inmate>) => action.payload,
  },
});

export const inmatesActions = inmatesSlice.actions;
