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
  numPastCalls: number;
}
