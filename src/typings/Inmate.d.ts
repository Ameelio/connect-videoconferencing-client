interface Inmate {
  id: number;
  inmateId: number;
  firstName: string;
  lastName: string;
  hasCallPrivilege: boolean;
  unit: string;
  dorm: string;
  imageUri?: string;
}
