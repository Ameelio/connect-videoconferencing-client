interface User {
  id: number;
  firstName: string;
  lastName: string;
  imageUri: string;
}

interface Inmate extends User {
  inmateId: string;
  hasCallPrivilege: boolean;
  unit: string;
  dorm: string;
}

interface Contact extends User {
  relationship: string;
  numPastCalls: number;
}
