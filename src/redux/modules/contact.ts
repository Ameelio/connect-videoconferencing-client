import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { fetchAuthenticated } from "src/api/Common";
import { Contact } from "src/typings/Contact";
import { IdentificationImages } from "src/typings/IdentificationImage";

export const fetchContacts = createAsyncThunk(
  "contact/fetchContacts",
  async () => {
    const body = await fetchAuthenticated(`contacts`);

    const contacts = (body.data as Record<string, unknown>)
      .results as Contact[];

    return contacts;
  }
);

export const fetchContactIdImages = createAsyncThunk(
  "contacts/fetchContactIdImages",
  async (userId: string) => {
    const body = await fetchAuthenticated(
      `contacts/${userId}/identificationImages`
    );

    const images = body.data as IdentificationImages;

    return images;
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
