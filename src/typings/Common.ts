export interface Route {
  path: string;
  component: React.ComponentType<any>;
  label: string;
}

export interface TableColumn {
  title: string;
  dataIndex: string;
  width?: string;
  editable?: boolean;
  render?: Function;
}

export type MemberType = "inmate" | "contact";

export enum VisitationType {
  FAMILY_IN_PERSON = "family_in_person_with_contact",
  FAMILY_IN_PERSON_NO_CONTACT = "family_in_person_no_contact",
  FAMILY_VIDEO_CALL = "family_video_call",
}
