import React from "react";
import { genImageUri, genFullName } from "src/utils/utils";
import { Image } from "react-bootstrap";

interface Props {
  inmate: Inmate;
  contact: Contact;
  kioskId?: number;
  fontColor: string;
  actionLabel: string;
}

const ConnectionCard: React.FC<Props> = ({
  inmate,
  contact,
  kioskId,
  fontColor,
  actionLabel,
}) => {
  return (
    <div className="d-flex flex-row">
      <div className="d-flex flex-column align-items-center">
        {kioskId && <span className="font-weight-bold">Kiosk {kioskId}</span>}
        <div className="facepile-container">
          <Image
            className="small-image facepile-image p4"
            src={genImageUri(inmate)}
            roundedCircle
          />
          <Image
            className="small-image facepile-image p4"
            src={genImageUri(contact)}
            roundedCircle
          />
        </div>
      </div>
      <div className="ml-4 d-flex flex-column">
        <span className={`${fontColor}`}>{genFullName(inmate)}</span>
        <div className="d-flex flex-row justify-content-between">
          <span className="p6 text-truncate">
            {actionLabel}{" "}
            <span className={` p6 ${fontColor}`}>{genFullName(contact)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
