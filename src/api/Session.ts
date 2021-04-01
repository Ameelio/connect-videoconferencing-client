import { API_URL, fetchTimeout } from "./Common";
import url from "url";
import { setSessionStatus, setSession } from "src/redux/modules/session";
import { Store } from "src/redux";
import camelcaseKeys from "camelcase-keys";
import { User, UserCredentials } from "src/typings/Session";

async function initializeSession(body: any) {
  const user = camelcaseKeys(body.data) as User;
  Store.dispatch(setSession(user));
}

export async function loginWithCredentials(
  cred: UserCredentials
): Promise<void> {
  Store.dispatch(setSessionStatus("loading"));
  const response = await fetchTimeout(url.resolve(API_URL, "auth/login"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: cred.email,
      password: cred.password,
    }),
  });
  const body = await response.json();
  if (response.status !== 201) {
    Store.dispatch(setSessionStatus("inactive"));
    throw body;
  }
  await initializeSession(body);
}
