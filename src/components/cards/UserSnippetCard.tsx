import React from "react";
import { CardType, CardSize } from "src/utils/constants";
import { Image } from "react-bootstrap";
import { genImageUri, genFullName } from "src/utils/utils";
import { format } from "date-fns";

interface Props {
  type: CardType;
  entity: Contact | Inmate;
  size: CardSize;
}

const UserSnippetCard: React.FC<Props> = ({ type, entity, size }) => {
  const nameFontSize = size === CardSize.Medium ? "p4" : "p3";
  const detailFontSize = size === CardSize.Medium ? "p5" : "p4";

  const genSnippet = (): JSX.Element => {
    switch (type) {
      case CardType.Contact:
        return (
          <div className="d-flex flex-column">
            <span className={`${nameFontSize} text-truncate`}>
              {genFullName(entity)}
            </span>
            <span className={`${detailFontSize}`}>
              {(entity as Contact).relationship}
            </span>
            <span className={`${detailFontSize}`}>
              {(entity as Contact).details}
            </span>
          </div>
        );
      case CardType.Inmate:
        return (
          <div className="d-flex flex-column">
            <span className={`${nameFontSize} text-truncate`}>
              {genFullName(entity)}
            </span>
            <span className={`${detailFontSize}`}>
              {(entity as Inmate).inmateNumber}
            </span>
            <span className={`${detailFontSize}`}>
              {(entity as Inmate).nodes[0].name}
            </span>
          </div>
        );
      default:
        return <div></div>;
    }
  };

  return (
    <div className="d-flex flex-row px-4 pt-1 align-items-center">
      <Image
        rounded
        className={`${size}-image mr-3`}
        src={genImageUri(entity)}
        roundedCircle
      />
      {genSnippet()}
    </div>
  );
};

export default UserSnippetCard;
