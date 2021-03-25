import { API_URL, fetchTimeout } from "./Common";
import url from "url";
import { setSessionStatus, setSession } from "src/redux/modules/session";
import { Store } from "src/redux";
import { REMEMBER_TOKEN_KEY, TOKEN_KEY } from "src/utils/constants";
import camelcaseKeys from "camelcase-keys";
import { User, UserCredentials } from "src/typings/Session";
import { ConsoleSqlOutlined } from "@ant-design/icons";

async function initializeSession(body: any) {
  const user = camelcaseKeys(body.data) as User;
  console.log(user);
  Store.dispatch(setSession(user));

  // localStorage.setItem(TOKEN_KEY, user.token);
  // localStorage.setItem(REMEMBER_TOKEN_KEY, user.remember);
}

export async function loginWithToken(): Promise<void> {
  try {
    const remember = localStorage.getItem(REMEMBER_TOKEN_KEY);
    if (!remember) {
      throw Error("Cannot load token");
    }
    Store.dispatch(setSessionStatus("loading"));
    const response = await fetchTimeout(
      url.resolve(API_URL, "auth/login/remember"),
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          remember: remember,
        }),
      }
    );
    const body = await response.json();
    if (body.status !== 200) {
      Store.dispatch(setSessionStatus("inactive"));
      throw body;
    }
    await initializeSession(body);
  } catch (err) {
    throw Error(err);
  }
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
  console.log(body);
  if (response.status !== 201) {
    Store.dispatch(setSessionStatus("inactive"));
    throw body;
  }
  await initializeSession(body);
}
