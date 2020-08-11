interface User {
  id: number;
  firstName: string;
  lastName: string;
  imageUri: string;
}

interface Inmate extends User {
  inmateId: string;
  hasCallPrivilege: boolean;
  pod: Pod;
}

interface Contact extends User {
  relationship: string;
  dob: Date;
  document: string;
}

type StaffRole = "admin" | "supervisor" | "operator" | "investigator";

interface Staff extends User {
  role: StaffRole;
  isActive: boolean; // TODO: replace the boolean with some token expiration logic
  email: string;
  facility: Facility;
}
