import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

export const contactsAdapter = createEntityAdapter<Contact>();

export const contactsSlice = createSlice({
  name: "inmates",
  initialState: contactsAdapter.getInitialState(),
  reducers: {
    contactsAddMany: contactsAdapter.addMany,
  },
});

export const contactsActions = contactsSlice.actions;
