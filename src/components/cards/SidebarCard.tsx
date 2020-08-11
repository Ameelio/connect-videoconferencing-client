import React from "react";
import { CardType } from "src/utils/constants";
import { Spinner } from "react-bootstrap";
import ConnectionCard from "./ConnectionCard";
import StaffCard from "./StaffCard";

interface Props {
  type: CardType;
  entity: LiveVisitation | ConnectionRequest | Staff;
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  isActive: boolean;
}

const SidebarCard: React.FC<Props> = ({
  type,
  entity,
  handleClick,
  isActive,
}) => {
  const activeBorder = isActive ? "left-sidebar-card-active" : "";
  const fontColor = isActive ? "primary" : "black-500";

  const genCard = (): JSX.Element => {
    switch (type) {
      case CardType.LiveVisitation:
        const { connection, id } = entity as LiveVisitation;
        const { inmate, contact } = connection;
        return inmate && contact ? (
          <ConnectionCard
            inmate={inmate}
            contact={contact}
            kioskId={id}
            fontColor={fontColor}
            actionLabel="Calling"
          />
        ) : (
          <Spinner animation="border" />
        );
      case CardType.ConnectionRequest:
        const connectionRequest = entity as ConnectionRequest;
        return connectionRequest.inmate && connectionRequest.contact ? (
          <ConnectionCard
            inmate={connectionRequest.inmate}
            contact={connectionRequest.contact}
            fontColor={fontColor}
            actionLabel="Requests"
          />
        ) : (
          <Spinner animation="border" />
        );
      case CardType.PastVisitation:
        const record = entity as RecordedVisitation;
        return record.connection.inmate && record.connection.contact ? (
          <ConnectionCard
            inmate={record.connection.inmate}
            contact={record.connection.contact}
            fontColor={fontColor}
            actionLabel="Called"
          />
        ) : (
          <Spinner animation="border" />
        );
      case CardType.Staff:
        const member = entity as Staff;
        return <StaffCard member={member} fontColor={fontColor} />;
      default:
        return <div></div>;
    }
  };
  return (
    <div
      className={`pr-3 py-4 left-sidebar-card border-bottom ${activeBorder}`}
      onClick={handleClick}
    >
      {genCard()}
    </div>
  );
};

export default SidebarCard;
