import { API_URL, fetchAuthenticated, toQueryString } from "./Common";
import url from "url";
import { Store } from "src/redux";
import { inmatesActions } from "src/redux/modules/inmate";
import camelcaseKeys from "camelcase-keys";
import { setStaff } from "src/redux/modules/staff";

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

  console.log(body.data);

  const staff = ((body.data as Record<string, unknown>)
    .admins as Object[]).map((admin) => camelcaseKeys(admin)) as Staff[];

  Store.dispatch(setStaff(staff));
  return staff;
}
