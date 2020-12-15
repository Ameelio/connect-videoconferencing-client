import { API_URL, fetchAuthenticated, fetchTimeout } from "./Common";
import url from "url";
import { setSession } from "src/redux/modules/user";
import { getInmates, getStaff } from "./Persona";
import { Store } from "src/redux";
import { getApprovedConnections } from "./Connection";

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

function cleanUser(user: RawUser): User {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    image: user.profile_img_path,
  };
}

async function initializeData() {
  await getInmates();
  await getApprovedConnections();
  await getStaff();
}

export async function loginWithCredentials(cred: UserLoginInfo): Promise<void> {
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
  if (!body.good) throw body;
  const user = cleanUser(body.data as RawUser);
  const { token: apiToken, remember: rememberToken } = body.data;
  Store.dispatch(
    setSession({
      user,
      authInfo: { rememberToken, apiToken },
      isLoggedIn: true,
    })
  );
  await initializeData();
}
