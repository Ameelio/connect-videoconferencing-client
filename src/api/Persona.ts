import { API_URL, fetchAuthenticated } from "./Common";
import url from "url";
import { Store } from "src/redux";
import { inmatesActions } from "src/redux/modules/inmate";
import camelcaseKeys from "camelcase-keys";
import { contactsActions } from "src/redux/modules/contact";

export async function getInmates(): Promise<Inmate[]> {
  const body = await fetchAuthenticated(`/inmates`, {}, false);

  if (body.status !== 200 || !body.data) {
    throw body;
  }

  const inmates = ((body.data as Record<string, unknown>)
    .inmates as Object[]).map((inmate) => camelcaseKeys(inmate)) as Inmate[];

  Store.dispatch(inmatesActions.inmatesAddMany(inmates));
  return inmates;
}

export async function getStaff(): Promise<Staff[]> {
  const body = await fetchAuthenticated(`/admins`);

  if (body.status !== 200 || !body.data) {
    throw body;
  }

  const staff = ((body.data as Record<string, unknown>)
    .admins as Object[]).map((admin) => camelcaseKeys(admin)) as Staff[];

  return staff;
}

export async function getContacts(): Promise<Contact[]> {
  const body = await fetchAuthenticated(`/users`);

  if (body.status !== 200 || !body.data) {
    throw body;
  }

  const contacts = ((body.data as Record<string, unknown>)
    .users as Object[]).map((contact) => camelcaseKeys(contact)) as Contact[];

  console.log(contacts);
  Store.dispatch(contactsActions.contactsAddMany(contacts));
  return contacts;
}
