import React from "react";
import { useAppDispatch, useAppSelector } from "src/redux";
import { updateCallStatus } from "src/redux/modules/call";
import { updateConnection } from "src/redux/modules/connections";
import { closeModal } from "src/redux/modules/modal";
import CancelReasonModal from "./CancelReasonModal";

interface Props {}

const Modal = (props: Props) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.modals.data);

  switch (data.activeType) {
    case "CANCEL_CALL_MODAL":
      return (
        <CancelReasonModal
          entity={data.entity}
          cancellationType={data.cancellationType}
          entityType={"call"}
          closeModal={() => dispatch(closeModal())}
          reasons={data.reasons}
          cancel={(id: string, reason: string) =>
            dispatch(
              updateCallStatus({
                id,
                status: data.cancellationType,
                statusDetails: reason,
              })
            )
          }
        />
      );
    case "CANCEL_CONNECTION_MODAL":
      return (
        <CancelReasonModal
          entity={data.entity}
          cancellationType={data.cancellationType}
          entityType={"connection"}
          closeModal={() => dispatch(closeModal())}
          reasons={data.reasons}
          cancel={(id: string, reason: string) =>
            dispatch(
              updateConnection({
                connectionId: id,
                status:
                  data.cancellationType === "cancelled"
                    ? "inactive"
                    : data.cancellationType,
                statusDetails: reason,
              })
            )
          }
        />
      );
    default:
      return <div />;
  }
};

export default Modal;
