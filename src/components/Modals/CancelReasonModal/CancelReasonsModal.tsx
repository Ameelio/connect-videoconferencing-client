import { Modal, Row, Space, Tag, Typography, Col } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState } from "react";
import { Call } from "src/typings/Call";
import { RejectionReason } from "src/typings/Common";
import { Connection } from "src/typings/Connection";
import {
  genFullName,
  getCallContactsFullNames,
  getCallInmatesFullNames,
} from "src/utils";

interface BaseCancelProps {
  reasons: RejectionReason[];
  cancel: (id: string, reason: string) => void;
  closeModal: () => void;
  cancellationType: "cancelled" | "rejected";
  entity: Call | Connection;
}

interface CancelConnectionProps extends BaseCancelProps {
  entity: Connection;
  entityType: "connection";
}

interface CancelCallProps extends BaseCancelProps {
  entity: Call;
  entityType: "call";
}

type Props = CancelConnectionProps | CancelCallProps;

const CancelCallModal = ({
  cancel,
  closeModal,
  reasons,
  entityType,
  cancellationType,
  entity,
}: Props) => {
  const [reason, setReason] = useState("");

  const getTitle = () => {
    const action = cancellationType === "cancelled" ? "Cancel" : "Reject";
    switch (entityType) {
      case "call":
        return `${action} call #${entity.id}?`;
      case "connection":
        return `${action} connection #${entity.id}?`;
      default:
        return "";
    }
  };

  const getBody = () => {
    const action =
      cancellationType === "cancelled" ? "cancellation" : "rejection";

    switch (entityType) {
      case "call":
        return ` Please provide a reason for the ${action} so we can inform{" "}
        ${getCallInmatesFullNames(
          entity as Call
        )} and ${getCallContactsFullNames(entity as Call)}:`;
      case "connection":
        return ` Please provide a reason for the ${action} so we can inform
        ${genFullName((entity as Connection).inmate)} and  ${genFullName(
          (entity as Connection).contact
        )}`;
    }
  };

  return (
    <Modal
      title={getTitle()}
      onOk={() => {
        cancel(entity.id, reason);
        closeModal();
      }}
      onCancel={closeModal}
      okText="Confirm"
      visible={true}
    >
      <Space direction="vertical">
        <Typography.Text>{getBody()}</Typography.Text>
        <Typography.Text>Common Reasons:</Typography.Text>

        <Row>
          {reasons.map((reason) => (
            <Col className="my-1">
              <Tag
                key={reason.key}
                onClick={() => setReason(reason.description)}
              >
                {reason.title}
              </Tag>
            </Col>
          ))}
        </Row>
        <TextArea
          rows={3}
          onChange={(e) => setReason(e.target.value)}
          value={reason}
        />
      </Space>
    </Modal>
  );
};

export default CancelCallModal;
