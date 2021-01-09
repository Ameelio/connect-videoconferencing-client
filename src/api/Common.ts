import { Store } from "src/redux";
import url from "url";
import { getApprovedConnections } from "./Connection";
import { getContacts, getInmates, getStaff } from "./Persona";

export const GENERAL_URL = "/";

export const API_URL = "api/";

export interface ApiResponse {
  date: number;
  good: boolean;
  status?: "OK" | "ERROR" | "succeeded" | 200;
  message?: string;
  data: Record<string, unknown> | Record<string, unknown>[] | unknown;
}

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
  nodeResource = true,
  timeout = 15000
): Promise<ApiResponse> {
  const state = Store.getState();

  const requestOptions = {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${state.session.authInfo.apiToken}`,
    },
  };

  const response = await fetchTimeout(
    `${API_URL}${
      nodeResource ? `node/${state.facilities.selected?.nodeId}/` : ""
    }${fetchUrl}`,
    requestOptions,
    timeout
  );
  const body = await response.json();
  return body;
}

export async function initializeAppData() {
  await Promise.allSettled([
    getInmates(),
    getApprovedConnections(),
    getStaff(),
    getContacts(),
  ]);
}
