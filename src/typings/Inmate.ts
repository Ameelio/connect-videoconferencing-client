export interface Inmate {
  id: number;
  firstName: string;
  lastName: string;
  inmateIdentification: string;
  dateOfBirth: Date;
  profileImagePath: string;
  backgroundImagePath: string;
  facilityId: number;
  quota: number;
}
