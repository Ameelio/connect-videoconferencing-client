import React, { ReactElement } from "react";
import { Button } from "react-bootstrap";
import UserSnippetCard from "src/components/cards/UserSnippetCard";
import { CardType, CardSize } from "src/utils/constants";
import { Table, Tag, Space, Layout } from "antd";
const { Column } = Table;
const { Content } = Layout;

interface Props {
  inmate: Inmate;
  contact: Contact;
  accept: (e: React.MouseEvent<HTMLDivElement>) => void;
  decline: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function ConnectionRequestCard({
  inmate,
  contact,
  accept,
  decline,
}: Props): ReactElement {
  return (
    <div>
      <div className="d-flex flex-row w-100 justify-content-evenly my-5">
        <UserSnippetCard
          type={CardType.Inmate}
          entity={inmate}
          size={CardSize.Large}
        />
        <UserSnippetCard
          type={CardType.Contact}
          entity={contact}
          size={CardSize.Large}
        />
      </div>
      <div className="d-flex flex-row my-5">
        <Button size="lg" onClick={accept}>
          Approve
        </Button>
        <Button size="lg" variant="light" className="ml-3" onClick={decline}>
          Decline
        </Button>
      </div>
    </div>
  );
}
