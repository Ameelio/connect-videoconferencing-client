import React from "react";
import UserSnippetCard from "./UserSnippetCard";
import { CardType } from "src/data/utils/constants";
import { Spinner } from "react-bootstrap";

interface Props {
  connection: Connection;
}

const ConnectionDetailsCard: React.FC<Props> = ({ connection }) => {
  const { inmate, contact } = connection;
  return inmate && contact ? (
    <div className="d-flex flex-row">
      <UserSnippetCard type={CardType.Inmate} entity={inmate} />
      <UserSnippetCard type={CardType.Contact} entity={contact} />
    </div>
  ) : (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
};

export default ConnectionDetailsCard;
