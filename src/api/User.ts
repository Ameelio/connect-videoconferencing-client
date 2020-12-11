import { API_URL, fetchTimeout } from "./Common";
import url from "url";

// export async function loginWithToken(): Promise<User> {
//     store.dispatch(setLoadingStatus(0));
//     try {
//       const rememberToken = await getItemAsync(Storage.RememberToken);
//       if (!rememberToken) {
//         throw Error('Cannot load token');
//       }
//       const response = await fetchTimeout(url.resolve(API_URL, 'login/token'), {
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           token: rememberToken,
//         }),
//       });
//       const body = await response.json();
//       if (body.status !== 'OK') throw body;
//       const userData = cleanUser(body.data as RawUser);
//       const { token, remember } = body.data;
//       await initializeData(userData, token, remember);
//       return userData;
//     } catch (err) {
//       Sentry.captureException(err);
//       store.dispatch(logoutUser());
//       throw Error(err);
//     }
//   }
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

export async function loginWithCredentials(
  cred: UserLoginInfo
): Promise<SessionState> {
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
  if (!body.good) throw body;
  const user = cleanUser(body.data as RawUser);
  console.log("Got data", body.data);
  const { token: apiToken, remember: rememberToken } = body.data;

  return { user, authInfo: { rememberToken, apiToken }, isLoggedIn: true };
}
