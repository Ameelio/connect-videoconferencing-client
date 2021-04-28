import { API_URL, fetchTimeout } from "./Common";
import url from "url";
import { setSessionStatus, setSession } from "src/redux/modules/session";
import { Store } from "src/redux";
import { User, UserCredentials } from "src/typings/Session";

async function initializeSession(token: string, body: any) {
  const user = body.data as User;
  Store.dispatch(setSession({ user, token }));
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
    credentials: "include",
    body: JSON.stringify({
      email: cred.email,
      password: cred.password,
    }),
  });
  const body = await response.json();

  if (response.status !== 201) {
    Store.dispatch(setSessionStatus("inactive"));
    throw response;
  }
  const token = response.headers.get("Authorization") || "";
  if (!token) throw new Error("Cannot find header token");
  await initializeSession(token, body);
}
