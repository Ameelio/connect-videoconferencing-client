import React from "react";
import { CardType } from "src/utils/constants";
import { Image } from "react-bootstrap";
import { genImageUri, genFullName } from "src/utils/utils";

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
            <span className="p4 text-truncate">{genFullName(entity)}</span>
            <span>{(entity as Contact).relationship}</span>
            <span>{(entity as Contact).numPastCalls}</span>
          </div>
        );
      case CardType.Inmate:
        return (
          <div className="d-flex flex-column">
            <span className="p4 text-truncate">{genFullName(entity)}</span>
            <span>{(entity as Inmate).inmateId}</span>
            <span>{(entity as Inmate).pod.name}</span>
          </div>
        );
      default:
        return <div></div>;
    }
  };

  return (
    <div className="d-flex flex-row border-right px-4 pt-1 align-items-center w-33 mw-33">
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
