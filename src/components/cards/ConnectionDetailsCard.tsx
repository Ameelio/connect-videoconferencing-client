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
  const { inmate, contact, recordedVisitations, numPastCalls } = connection;

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
      <div className="d-flex flex-column past-visitations-wrapper">
        <span className="black-400 p6">Past Visitations ({numPastCalls})</span>
        {Array.from(recordedVisitations.values()).map(
          (record: RecordedVisitation) => (
            <RecordedVisitationSnippetCard key={record.id} record={record} />
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

export default ConnectionDetailsCard;
