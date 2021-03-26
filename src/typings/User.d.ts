interface BasePersona {
  id: number;
  firstName: string;
  lastName: string;
  profileImagePath?: string;
}

type StaffRole = "admin" | "operator" | "investigator";

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
