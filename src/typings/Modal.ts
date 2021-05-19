import { Call } from "./Call";

export type ModalType =
  | "INACTIVE_MODAL"
  | "CANCEL_CALL_MODAL"
  | "SEND_ALERT_MODAL";

interface BaseModal {
  activeType: ModalType;
  entity: any;
}

export interface InactiveModalData extends BaseModal {
  activeType: "INACTIVE_MODAL";
  entity: null;
}

export interface CancelCallModalData extends BaseModal {
  activeType: "CANCEL_CALL_MODAL";
  entity: Call;
}

export interface SendAlertModalData extends BaseModal {
  activeType: "SEND_ALERT_MODAL";
  entity: { call: Call; alert: string };
}
