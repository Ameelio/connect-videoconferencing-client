import React from "react";
import Image from "react-bootstrap/Image";
import { CardType } from "src/utils/constants";
import { genFullName, genImageUri } from "src/utils/utils";

interface Props {
  type: CardType;
  entity: LiveVisitation | Contact;
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
          <div className="d-flex flex-row">
            <div className="d-flex flex-column align-items-center">
              <span className="font-weight-bold">Kiosk {id}</span>
              <div className="facepile-container">
                <Image
                  className="small-image facepile-image p4"
                  src={genImageUri(connection?.inmate)}
                  roundedCircle
                />
                <Image
                  className="small-image facepile-image p4"
                  src={genImageUri(connection?.contact)}
                  roundedCircle
                />
              </div>
            </div>
            <div className="ml-4 d-flex flex-column">
              <span className={`${fontColor}`}>
                {genFullName(connection?.inmate)}
              </span>
              <div className="d-flex flex-row justify-content-between">
                <span className="p6 text-truncate">
                  Calling {genFullName(connection?.contact)}
                </span>
              </div>
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
      {genCard()}
    </div>
  );
};

export default SidebarCard;
