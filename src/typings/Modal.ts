import { Call, CallStatus } from "./Call";
import { RejectionReason } from "./Common";
import { Connection } from "./Connection";

export type ModalType =
  | "INACTIVE_MODAL"
  | "CANCEL_CALL_MODAL"
  | "CANCEL_CONNECTION_MODAL"
  | "SEND_ALERT_MODAL"
  | "REJECT_CONNECTION_MODAL";

interface BaseModal {
  activeType: ModalType;
  entity: any;
}

export interface InactiveModalData extends BaseModal {
  activeType: "INACTIVE_MODAL";
  entity: null;
}

interface CancelModalData extends BaseModal {
  entity: Call | Connection;
  reasons: RejectionReason[];
  cancellationType: "cancelled" | "rejected";
}

export interface CancelConnectionModalData extends CancelModalData {
  activeType: "CANCEL_CONNECTION_MODAL";
  entity: Connection;
}

export interface CancelCallModalData extends CancelModalData {
  activeType: "CANCEL_CALL_MODAL";
  entity: Call;
}

export interface SendAlertModalData extends BaseModal {
  activeType: "SEND_ALERT_MODAL";
  entity: { call: Call; alert: string };
}

export interface RejectConnectionModalData extends BaseModal {
  activeType: "SEND_ALERT_MODAL";
  entity: { call: Call; reason: string };
}
