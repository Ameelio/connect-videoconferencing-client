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

export function toQueryString(options: string[][]) {
  return options.map((x) => x[0] + "=" + encodeURIComponent(x[1])).join("&");
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
  return body;
}
