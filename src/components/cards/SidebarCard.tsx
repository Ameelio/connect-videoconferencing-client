import React from "react";
import Image from "react-bootstrap/Image";
import { CardType } from "src/data/utils/constants";

interface Props {
  type: CardType;
  entity: Kiosk;
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

  const generateComponent = (type: CardType): JSX.Element => {
    switch (type) {
      case CardType.Kiosk:
        return (
          <div className="d-flex flex-row">
            {" "}
            <Image
              className="small-image p4"
              src={entity.connection?.inmate?.imageUri}
              roundedCircle
            />
            <Image
              className="small-image p4"
              src={entity.connection?.contact?.imageUri}
              roundedCircle
            />
            <div className="ml-4 d-flex flex-column">
              <span className={`${fontColor} p4`}>
                {entity.connection?.inmate?.firstName}
              </span>
            </div>
          </div>
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
      {generateComponent(type)}
    </div>
  );
};

export default SidebarCard;
