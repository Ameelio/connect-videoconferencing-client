import React from "react";
import { Table, Space, Avatar, Button } from "antd";
import { Connection } from "src/typings/Connection";
import { format } from "date-fns";
import { genFullName } from "src/utils";
import { Inmate } from "src/typings/Inmate";
import { Contact } from "src/typings/Contact";

interface Props {
  connections: Connection[];
  accept: (connection: Connection) => void;
  reject: (connection: Connection) => void;
}

const ConnectionRequests = ({ connections, accept, reject }: Props) => {
  return (
    <Table dataSource={connections}>
      <Table.Column
        title=""
        dataIndex="inmate"
        key="inmateProfilePic"
        render={(inmate: Inmate) => (
          <>
            {<Avatar src={inmate.profileImagePath} shape="circle" size={64} />}
          </>
        )}
      />
      <Table.Column
        title="Inmate"
        dataIndex="inmate"
        key="inmateProfilePic"
        render={(inmate: Inmate) => (
          <>
            <Space direction="vertical">
              <span>{genFullName(inmate)}</span>
              <span>{inmate.inmateIdentification}</span>
              <span>{format(new Date(inmate.dateOfBirth), "dd/mm/yy")}</span>
            </Space>
          </>
        )}
      />
      <Table.Column
        title=""
        dataIndex="contact"
        key="contactProfilePic"
        render={(contact: Contact) => (
          <>
            <Avatar src={contact.profileImagePath} shape="circle" size={64} />
          </>
        )}
      />
      <Table.Column
        title="Contact"
        dataIndex="contact"
        key="contactInfo"
        render={(contact: Contact) => (
          <>
            <Space direction="vertical">
              <span>{genFullName(contact)}</span>
              <span>Visitor ID: {contact.id}</span>
            </Space>
          </>
        )}
      />
      <Table.Column
        title="Relationship"
        dataIndex="relationship"
        key="relationship"
      />
      <Table.Column
        title=""
        key="actions"
        render={(_text, request: Connection) => (
          <Space>
            <Button type="primary" onClick={() => accept(request)}>
              Accept
            </Button>
            <Button danger onClick={() => reject(request)}>
              Reject
            </Button>
          </Space>
        )}
      />
    </Table>
  );
};

export default ConnectionRequests;
