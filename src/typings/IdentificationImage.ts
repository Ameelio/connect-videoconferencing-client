enum PrivateFileCategory {
  SELFIE_ID = "selfie_id",
  FRONT_ID = "front_id",
  BACK_ID = "back_id",
}

interface IdentificationImage {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  ownerMalanId: string;
  key: string;
  category: PrivateFileCategory;
  url: string;
}

export interface IdentificationImages {
  frontIdFile: IdentificationImage | null;
  backIdFile: IdentificationImage | null;
  selfieIdFile: IdentificationImage | null;
}
