import { API_URL, fetchTimeout } from "./Common";
import url from "url";
import { setSession } from "src/redux/modules/user";
import { Store } from "src/redux";
import { REMEMBER_TOKEN_KEY, TOKEN_KEY } from "src/utils/constants";
import { fetchFacilities } from "src/redux/modules/facility";
import camelcaseKeys from "camelcase-keys";
import { User, UserCredentials } from "src/typings/Session";

interface RawUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  addr_line_1: string;
  addr_line_2: string;
  city: string;
  state: string;
  postal: string;
  credit: number;
  coins: number;
  profile_img_path: string;
  phone: string;
  referer: string;
  country: string;
  created_at: string;
  referral_link: string;
}

async function initializeSession(body: any) {
  const user = camelcaseKeys(body.data) as User;
  Store.dispatch(
    setSession({
      user,
      isLoggedIn: true,
    })
  );

  Store.dispatch(fetchFacilities);
  // TO
  localStorage.setItem(TOKEN_KEY, user.token);
  localStorage.setItem(REMEMBER_TOKEN_KEY, user.remember);
  // loadData();
}

export async function loginWithToken(): Promise<void> {
  try {
    const remember = await localStorage.getItem(REMEMBER_TOKEN_KEY);
    if (!remember) {
      throw Error("Cannot load token");
    }
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
    if (body.status !== 200) throw body;
    await initializeSession(body);
  } catch (err) {
    throw Error(err);
  }
}

export async function loginWithCredentials(
  cred: UserCredentials
): Promise<void> {
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
  if (body.status !== 200) throw body;
  await initializeSession(body);
}
