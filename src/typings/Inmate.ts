export interface Inmate {
  id: string;
  firstName: string;
  lastName: string;
  inmateIdentification: string;
  dateOfBirth: Date;
  profileImagePath: string;
  backgroundImagePath: string;
  facilityId: string;
  quota: number;
  malanId: string;
}
