import { Store } from "src/redux";
import { openNotificationWithIcon, showToast } from "src/utils";

export const API_URL = process.env.REACT_APP_API_URL || "api/v1/";

export interface ApiResponse {
  date: number;
  good: boolean;
  status: number;
  message?: string;
  data: Record<string, unknown> | Record<string, unknown>[] | unknown;
}

export function fetchTimeout(
  fetchUrl: string,
  options: Record<string, unknown>,
  timeout = 15000
): Promise<Response> {
  return Promise.race([
    fetch(fetchUrl, { ...options, mode: "cors" }),
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
  nodeResource = true,
  timeout = 15000
): Promise<ApiResponse> {
  const state = Store.getState();

  const requestOptions = {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: state.session.authInfo.token,
    },
    credentials: "include",
  };

  const url = `${API_URL}${
    nodeResource ? `facilities/${state.facilities.selected?.id}/` : ""
  }${fetchUrl}`;
  const response = await fetchTimeout(url, requestOptions, timeout);

  if (response.status === 400 || response.status === 403) {
    showToast(
      "fetchAuthenticated",
      "You are not allowed to perform this action. Contact the admin.",
      "error"
    );
  }

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`Failed to access resource ${fetchUrl}`);
  }

  const body = await response.json();
  return body;
}
