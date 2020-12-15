interface BasePersona {
  id: number;
  firstName: string;
  lastName: string;
  imageUri?: string;
}

interface Inmate extends BasePersona {
  inmateNumber: string;
  dateOfBirth: Date;
  quota: number;
  sentence: string;
  sentnceLength: string;
  location: string;
  race: string;
  nodes: AmeelioNode[];
}

interface Contact extends BasePersona {
  relationship: string;
  details: string;
}

type StaffRole = "admin" | "supervisor" | "operator" | "investigator";

interface Staff extends BasePersona {
  role: StaffRole;
  isActive: boolean; // TODO: replace the boolean with some token expiration logic
  email: string;
  facility: AmeelioNode;
}

interface UserLoginInfo {
  email: string;
  password: string;
  remember?: boolean;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

interface AuthInfo {
  apiToken: string;
  rememberToken: string;
}

interface SessionState {
  isLoggedIn: boolean;
  authInfo: AuthInfo;
  user: User;
}
