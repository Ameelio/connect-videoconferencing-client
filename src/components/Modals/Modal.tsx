import React from "react";
import { useAppDispatch, useAppSelector } from "src/redux";
import { updateCallStatus } from "src/redux/modules/call";
import { closeModal } from "src/redux/modules/modal";
import CancelCallModal from "./CancelCallModal";

interface Props {}

const Modal = (props: Props) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.modals.data);

  switch (data.activeType) {
    case "CANCEL_CALL_MODAL":
      return (
        <CancelCallModal
          call={data.entity}
          closeModal={() => dispatch(closeModal())}
          cancelCall={(id: number, reason: string) =>
            dispatch(
              updateCallStatus({
                id,
                status: "cancelled",
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
