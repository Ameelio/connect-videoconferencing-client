import { Store } from "src/redux";

export const GENERAL_URL = "/";

export const API_URL = "/api/";

export interface ApiResponse {
  date: number;
  good: boolean;
  status?: "OK" | "ERROR" | "succeeded";
  message?: string;
  data: Record<string, unknown> | Record<string, unknown>[] | unknown;
}

// export interface UserResponse {
//     type: string;
//     data: User;
// }

export function fetchTimeout(
  fetchUrl: string,
  options: Record<string, unknown>,
  timeout = 15000
): Promise<Response> {
  return Promise.race([
    fetch(fetchUrl, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), timeout)
    ),
  ]);
}

export async function fetchAuthenticated(
  fetchUrl: string,
  options: Record<string, unknown> = {},
  timeout = 15000
): Promise<ApiResponse> {
  const requestOptions = {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${Store.getState().session.authInfo.apiToken}`,
    },
  };
  const response = await fetchTimeout(fetchUrl, requestOptions, timeout);
  const body = await response.json();
  //     let { rememberToken } = store.getState().user.authInfo;
  //     if (rememberToken === '' || !rememberToken) {
  //     rememberToken = (await getItemAsync(Storage.RememberToken)) || '';
  //     }
  //     if (
  //     body.message &&
  //     body.message === 'Unauthenticated.' &&
  //     rememberToken &&
  //     rememberToken !== ''
  //     ) {
  //     // attempt to refresh the api token using the remember token
  //     const tokenResponse = await fetchTimeout(
  //     url.resolve(API_URL, 'login/token'),
  //     {
  //         method: 'POST',
  //         headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //         token: rememberToken,
  //         }),
  //     }
  //     );
  //     const tokenBody = await tokenResponse.json();
  //     if (tokenBody.status !== 'OK') {
  //     store.dispatch(logoutUser());
  //     throw Error('Invalid token');
  //     }
  //     const userData: User = {
  //     id: tokenBody.data.id,
  //     firstName: tokenBody.data.first_name,
  //     lastName: tokenBody.data.last_name,
  //     email: tokenBody.data.email,
  //     address1: tokenBody.data.addr_line_1,
  //     address2: tokenBody.data.addr_line_2 || '',
  //     postal: tokenBody.data.postal,
  //     city: tokenBody.data.city,
  //     state: tokenBody.data.state,
  //     credit: tokenBody.data.credit,
  //     coins: tokenBody.data.coins,
  //     joined: tokenBody.data.created_at,
  //     referralCode: tokenBody.data.referral_link,
  //     };
  //     store.dispatch(
  //     authenticateUser(userData, tokenBody.data.token, tokenBody.data.remember)
  //     );
  //     store.dispatch(loginUser(userData));
  //     // successfully logged in using the remember token, retry the original api call
  //     const retryOptions = {
  //     ...options,
  //     headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${store.getState().user.authInfo.apiToken}`,
  //     },
  // };
  // const retryResponse = await fetchTimeout(fetchUrl, retryOptions, timeout);
  // const retryBody = await retryResponse.json();
  // return retryBody;
  // }
  return body;
}
