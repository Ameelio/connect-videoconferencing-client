import React, { ReactElement } from "react";
import { Image } from "react-bootstrap";
import { genFullName } from "src/utils/utils";
import { CardType } from "src/utils/constants";

interface Props {
  type: CardType;
  user: Staff | Inmate | Contact;
  fontColor: string;
}

export default function UserCard({
  user,
  fontColor,
  type,
}: Props): ReactElement {
  console.log(user);
  const genDetails = (): JSX.Element => {
    switch (type) {
      case CardType.Inmate:
        const inmate = user as Inmate;
        return <span className="p6 ">{inmate.inmateNumber}</span>;
      case CardType.Contact:
        const contact = user as Contact;
        return <span className="p6 ">{contact.relationship}</span>;
      default:
        return <div></div>;
    }
  };
  return (
    <div className="d-flex flex-row">
      <Image src={user.imageUri} roundedCircle className="small-image" />
      <div className="d-flex flex-column ml-3">
        <span className={fontColor}>{genFullName(user)}</span>
        {genDetails()}
      </div>
    </div>
  );
}
