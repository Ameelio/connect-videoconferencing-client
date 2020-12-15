import React from "react";
import UserSnippetCard from "./UserSnippetCard";
import { CardType, CardSize } from "src/utils/constants";
import { Spinner } from "react-bootstrap";
import RecordedVisitationSnippetCard from "./RecordedVisitationSnippetCard";
import "./ConnectionDetailsCard.css";

interface Props {
  connection: Connection;
}

const ConnectionDetailsCard: React.FC<Props> = ({ connection }) => {
  const { inmate, contact } = connection;

  return inmate && contact ? (
    <div className="d-flex flex-row">
      <UserSnippetCard
        type={CardType.Inmate}
        entity={inmate}
        size={CardSize.Medium}
      />
      <UserSnippetCard
        type={CardType.Contact}
        entity={contact}
        size={CardSize.Medium}
      />
    </div>
  ) : (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
};

export default ConnectionDetailsCard;
