import React from "react";
import { Table, Space, Button } from "antd";
import { Connection } from "src/typings/Connection";
import { genFullName } from "src/utils";
import { Inmate } from "src/typings/Inmate";
import { Contact } from "src/typings/Contact";
import Avatar from "../Avatar";
import ContactCell from "./ContactCell";
import InmateCell from "./InmateCell";

interface Props {
  connections: Connection[];
  accept: (connection: Connection) => void;
  reject: (connection: Connection) => void;
  navigate: (path: string) => void;
  loading?: boolean;
}

const ConnectionRequests = ({
  connections,
  accept,
  reject,
  navigate,
  loading,
}: Props) => {
  return (
    <Table dataSource={connections} loading={loading}>
      <Table.Column
        title=""
        dataIndex="inmate"
        key="inmateProfilePic"
        render={(inmate: Inmate) => (
          <>
            {
              <Avatar
                src={inmate.profileImagePath}
                fallback={genFullName(inmate)}
                size={64}
              />
            }
          </>
        )}
      />
      <Table.Column
        title="Inmate"
        dataIndex="inmate"
        key="inmateProfilePic"
        render={(inmate: Inmate) => (
          <>
            <InmateCell inmate={inmate} navigate={navigate} />
          </>
        )}
      />
      <Table.Column
        title=""
        dataIndex="contact"
        key="contactProfilePic"
        render={(contact: Contact) => (
          <>
            <Avatar
              src={contact.profileImagePath}
              fallback={genFullName(contact)}
              size={64}
            />
          </>
        )}
      />
      <Table.Column
        title="Contact"
        dataIndex="contact"
        key="contactInfo"
        render={(contact: Contact) => (
          <>
            <ContactCell contact={contact} navigate={navigate} />
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
