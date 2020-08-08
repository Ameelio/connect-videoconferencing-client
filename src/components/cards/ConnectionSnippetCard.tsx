import React from "react";
import UserSnippetCard from "./UserSnippetCard";
import { CardType } from "src/utils/constants";
import { Spinner } from "react-bootstrap";
import RecordedVisitationSnippetCard from "./RecordedVisitationSnippetCard";
import "./ConnectionSnippetCard.css";

interface Props {
  connection: Connection;
}

const ConnectionSnippetCard: React.FC<Props> = ({ connection }) => {
  const { inmate, contact, recordedVisitations } = connection;
  return inmate && contact ? (
    <div className="d-flex flex-row">
      <UserSnippetCard type={CardType.Inmate} entity={inmate} />
      <UserSnippetCard type={CardType.Contact} entity={contact} />
      <div className="d-flex flex-column past-visitations-wrapper">
        {Array.from(recordedVisitations.values()).map(
          (record: RecordedVisitation) => (
            <RecordedVisitationSnippetCard record={record} />
          )
        )}
      </div>
    </div>
  ) : (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
};

export default ConnectionSnippetCard;
