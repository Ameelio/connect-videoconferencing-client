import { API_URL, fetchAuthenticated, toQueryString } from "./Common";
import url from "url";
import { Store } from "src/redux";
import { inmatesActions } from "src/redux/modules/inmate";
import camelcaseKeys from "camelcase-keys";
import { setStaff } from "src/redux/modules/staff";
import { contactsActions } from "src/redux/modules/contact";

export async function getInmates(): Promise<Inmate[]> {
  const body = await fetchAuthenticated(url.resolve(API_URL, `node/1/inmates`));

  if (!body.good || !body.data) {
    throw body;
  }

  const inmates = ((body.data as Record<string, unknown>)
    .inmates as Object[]).map((inmate) => camelcaseKeys(inmate)) as Inmate[];

  Store.dispatch(inmatesActions.inmatesAddMany(inmates));
  return inmates;
}

export async function getStaff(): Promise<Staff[]> {
  const body = await fetchAuthenticated(url.resolve(API_URL, `node/1/admins`));

  if (!body.good || !body.data) {
    throw body;
  }

  const staff = ((body.data as Record<string, unknown>)
    .admins as Object[]).map((admin) => camelcaseKeys(admin)) as Staff[];

  Store.dispatch(setStaff(staff));
  return staff;
}

export async function getContacts(): Promise<Contact[]> {
  const body = await fetchAuthenticated(url.resolve(API_URL, `node/1/users`));

  if (!body.good || !body.data) {
    throw body;
  }

  const contacts = ((body.data as Record<string, unknown>)
    .users as Object[]).map((contact) => camelcaseKeys(contact)) as Contact[];

  Store.dispatch(contactsActions.contactsAddMany(contacts));
  return contacts;
}
