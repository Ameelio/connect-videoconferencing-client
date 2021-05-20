interface IdentificationImage {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  ownerMalanId: string;
  key: string;
  category: string;
  url: string;
}

export interface IdentificationImages {
  frontIdFile: IdentificationImage | null;
  backIdFile: IdentificationImage | null;
  selfieIdFile: IdentificationImage | null;
}
