import { RejectionReason } from "src/typings/Common";

export const DEFAULT_CONNECTION_REJECTION_REASONS: RejectionReason[] = [
  {
    title: "Bad ID",
    description:
      "Please re-take the photos of your governments ID and re-submit the connection request.",
    key: "bad_id",
  },
  {
    title: "Not Allowed",
    description:
      "You're unfortunately not allowed to be added to the visitation list of this incarcerated person.",
    key: "not_allowed",
  },
  {
    title: "Invalid Information",
    description: "You submitted incorrect or incomplete information.",
    key: "invalid_info",
  },
];
