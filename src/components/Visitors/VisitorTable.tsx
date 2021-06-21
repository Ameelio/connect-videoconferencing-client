import React from "react";
import { Table, Button } from "antd";
import { Contact } from "src/typings/Contact";
import Avatar from "../Avatar";
import { genFullName } from "src/utils";

interface Props {
  visitors: Contact[];
  loading?: boolean;
  navigateToProfile: (id: string) => void;
}

const VisitorTable = ({ visitors, loading, navigateToProfile }: Props) => {
  return (
    <Table dataSource={visitors} loading={loading}>
      <Table.Column
        title=""
        key="profileImagePath"
        render={(_text, contact: Contact) => (
          <>
            <Avatar fallback={genFullName(contact)} size={48} />
          </>
        )}
      />
      <Table.Column title="First Name" dataIndex="firstName" key="firstName" />
      <Table.Column title="Last Name" dataIndex="lastName" key="lastName" />
      <Table.Column title="Email" dataIndex="email" key="email" />
      <Table.Column
        title=""
        key="view"
        render={(_text, contact: Contact) => (
          <Button onClick={() => navigateToProfile(contact.id)}>View</Button>
        )}
      />
    </Table>
  );
};

export default VisitorTable;
