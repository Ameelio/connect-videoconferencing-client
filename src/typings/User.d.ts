interface BasePersona {
  id: number;
  firstName: string;
  lastName: string;
  profileImgPath?: string;
}

interface Inmate extends BasePersona {
  inmateNumber: string;
  dob: string;
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
  email: string;
  dob: string;
}

type StaffRole = "admin" | "supervisor" | "operator" | "investigator";

type Permission =
  | "allowRead"
  | "allowCalltimes"
  | "allowApproval"
  | "allowRestructure"
  | "allowMonitor";

interface Staff extends BasePersona {
  permissions: Permission[];
  role: StaffRole;
  email: string;
}

interface UserLoginInfo {
  email: string;
  password: string;
  remember?: boolean;
}

interface User extends BasePersona {
  email: string;
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
