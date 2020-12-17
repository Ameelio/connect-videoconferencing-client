interface BasePersona {
  id: number;
  firstName: string;
  lastName: string;
  profileImgPath?: string;
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
  email: string;
}

type StaffRole = "admin" | "supervisor" | "operator" | "investigator";

type Permissions =
  | "allowRead"
  | "allowCalltimes"
  | "allowApproval"
  | "allowRestructure"
  | "allowMonitor";

interface Staff extends BasePersona {
  permissions: Permissions[];
  role: StaffRole;
  email: string;
  // TODO move this to a different place on the redux store. It's gonna be selected beforehand.
  // facility: AmeelioNode;
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
