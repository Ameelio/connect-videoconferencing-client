import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { fetchAuthenticated } from "src/api/Common";
import camelcaseKeys from "camelcase-keys";

export const fetchContacts = createAsyncThunk(
  "contact/fetchContacts",
  async () => {
    const body = await fetchAuthenticated(`/users`);

    if (body.status !== 200 || !body.data) {
      throw body;
    }

    const contacts = ((body.data as Record<string, unknown>)
      .users as Object[]).map((contact) => camelcaseKeys(contact)) as Contact[];

    return contacts;
  }
);

export const contactsAdapter = createEntityAdapter<Contact>();

export const contactsSlice = createSlice({
  name: "inmates",
  initialState: contactsAdapter.getInitialState(),
  reducers: {
    contactsAddMany: contactsAdapter.addMany,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchContacts.fulfilled, (state, action) =>
      contactsAdapter.setAll(state, action.payload)
    );
    builder.addCase(fetchContacts.rejected, (state, action) =>
      console.log("error")
    );
  },
});

export const contactsActions = contactsSlice.actions;
