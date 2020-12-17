import React from "react";
import { CardType } from "src/utils/constants";
import ConnectionCard from "./ConnectionCard";
import UserCard from "./UserCard";

interface Props {
  type: CardType;
  entity: LiveVisitation | BaseConnection | Staff | Inmate;
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
        return (
          <ConnectionCard
            inmate={connection.inmate}
            contact={connection.contact}
            kioskId={id}
            fontColor={fontColor}
            actionLabel="Calling"
          />
        );
      case CardType.ConnectionRequest:
        const connectionRequest = entity as Connection;
        return (
          <ConnectionCard
            inmate={connectionRequest.inmate}
            contact={connectionRequest.contact}
            fontColor={fontColor}
            actionLabel="Requests"
          />
        );
      case CardType.PastVisitation:
        const record = entity as RecordedVisitation;
        return (
          <ConnectionCard
            inmate={record.connection.inmate}
            contact={record.connection.contact}
            fontColor={fontColor}
            actionLabel="Called"
          />
        );
      case CardType.Staff:
        const member = entity as Staff;
        return (
          <UserCard user={member} fontColor={fontColor} type={CardType.Staff} />
        );
      case CardType.Inmate:
        const inmate = entity as Inmate;
        return (
          <UserCard
            user={inmate}
            fontColor={fontColor}
            type={CardType.Inmate}
          />
        );

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
