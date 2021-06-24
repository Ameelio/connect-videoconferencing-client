import { RejectionReason } from "src/typings/Common";

export const DEFAULT_CONNECTION_REJECTION_REASONS: RejectionReason[] = [
  {
    title: "Unclear Photo ID",
    description:
      "The pictures you originally submitted are unclear. Please re-take the pictures of your governments ID and re-submit the connection request.",
    key: "bad_id",
  },
  {
    title: "Not an Approved Visitor",
    description:
      "You must be an approved visitor to request a connection. Please refer to ",
    key: "not_allowed",
  },
  {
    title: "Inaccurate/Incomplete Information",
    description: "You submitted inaccurate or incomplete information.",
    key: "invalid_info",
  },
];
