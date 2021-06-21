import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { fetchAuthenticated } from "src/api/Common";
import { Contact } from "src/typings/Contact";
import { IdentificationImages } from "src/typings/IdentificationImage";
import { showToast } from "src/utils";

const FETCH_CONTACTS = "contact/fetchContact";
export const fetchContacts = createAsyncThunk(FETCH_CONTACTS, async () => {
  const body = await fetchAuthenticated(`contacts`);

  const contacts = (body.data as Record<string, unknown>).results as Contact[];

  return contacts;
});

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
  initialState: contactsAdapter.getInitialState({ loading: false }),
  reducers: {
    contactsAddMany: contactsAdapter.addMany,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchContacts.fulfilled, (state, action) => {
      contactsAdapter.setAll(state, action.payload);
      state.loading = false;
    });
    builder.addCase(fetchContacts.rejected, (state, action) => {
      showToast(FETCH_CONTACTS, "Failed to load list of visitors", "error");
      state.loading = false;
    });
    builder.addCase(fetchContacts.pending, (state) => {
      state.loading = true;
    });
  },
});

export const contactsActions = contactsSlice.actions;
