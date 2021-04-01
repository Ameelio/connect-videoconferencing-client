import { Store } from "src/redux";

export const API_URL = process.env.REACT_APP_BASE_URL || "";

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
    },
    credentials: "include",
  };

  const url = `${API_URL}${
    nodeResource ? `facilities/${state.facilities.selected?.id}/` : ""
  }${fetchUrl}`;
  const response = await fetchTimeout(url, requestOptions, timeout);

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`Failed to access resource ${fetchUrl}`);
  }
  const body = await response.json();
  return body;
}
