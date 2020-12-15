import React, { ReactElement } from "react";
import { Image } from "react-bootstrap";
import { CardType } from "src/utils/constants";
import { genFullName } from "src/utils/utils";

interface Props {
  type: CardType;
  user: Staff | Inmate;
}

function UserDetailsCard({ user, type }: Props): ReactElement {
  const genDetails = (): JSX.Element => {
    switch (type) {
      case CardType.Staff:
        const staff = user as Staff;
        return (
          <div className="d-flex flex-column">
            <span className="p6 black-400 text-capitalize">{staff.role}</span>
            <span className="p6 black-500">{genFullName(staff)}</span>
            <span className="p6 black-500">{staff.email}</span>
            <span className="p6 black-500">{staff.facility.name}</span>
          </div>
        );
      case CardType.Inmate:
        const inmate = user as Inmate;
        return (
          <div className="d-flex flex-column border-bottom pb-3">
            <span className="p6 black-500">{genFullName(inmate)}</span>
            <span className="p6 black-500">{inmate.inmateNumber}</span>
            <span className="p6 black-500">
              {inmate.nodes[inmate.nodes.length - 1].name}
            </span>
          </div>
        );

      default:
        return <div></div>;
    }
  };

  return (
    <div className="d-flex flex-column align-items-center text-center">
      <Image className="large-image mb-3" src={user.imageUri} roundedCircle />
      {genDetails()}
    </div>
  );
}

export default UserDetailsCard;
