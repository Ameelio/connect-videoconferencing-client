import React from "react";
import { CardType } from "src/data/utils/constants";
import { Image } from "react-bootstrap";
import { genImageUri, genFullName } from "src/data/utils/utils";

interface Props {
  type: CardType;
  entity: Contact | Inmate;
}

const UserSnippetCard: React.FC<Props> = ({ type, entity }) => {
  const genSnippet = (): JSX.Element => {
    switch (type) {
      case CardType.Contact:
        return (
          <div className="d-flex flex-column">
            <span className="p3">{genFullName(entity)}</span>
            <span>{(entity as Contact).relationship}</span>
            <span>{(entity as Contact).numPastCalls}</span>
          </div>
        );
      case CardType.Inmate:
        return (
          <div className="d-flex flex-column">
            <span className="p3">{genFullName(entity)}</span>
            <span>{(entity as Inmate).inmateId}</span>
            <span>
              {(entity as Inmate).unit}, {(entity as Inmate).dorm}
            </span>
          </div>
        );
      default:
        return <div></div>;
    }
  };

  return (
    <div className="d-flex flex-row border-right px-4 pt-1 justify-content-between align-items-center">
      <Image
        rounded
        className="medium-image mr-3"
        src={genImageUri(entity)}
        roundedCircle
      />
      {genSnippet()}
    </div>
  );
};

export default UserSnippetCard;
