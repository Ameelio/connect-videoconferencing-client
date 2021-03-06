import { Staff } from "./Staff";

export interface User extends BasePersona {
  email: string;
  staffPositions: Staff[];
}

export interface UserCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AuthInfo {
  type: "doc";
  id: string;
  token: string;
}
