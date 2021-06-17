import React from "react";
import { Table, Space, Button, Typography } from "antd";
import { format } from "date-fns";
import { genFullName } from "src/utils";
import { Inmate } from "src/typings/Inmate";
import { Contact } from "src/typings/Contact";
import { Call, ISOString } from "src/typings/Call";
import Avatar from "../Avatar";
import ContactCell from "./ContactCell";
import InmateCell from "./InmateCell";

interface Props {
  calls: Call[];
  accept: (connection: Call) => void;
  reject: (connection: Call) => void;
  navigate: (path: string) => void;
  loading?: boolean;
}

export const CallRequests = ({
  calls,
  accept,
  reject,
  navigate,
  loading,
}: Props) => {
  return (
    <Table dataSource={calls} loading={loading}>
      <Table.Column
        title=""
        dataIndex="inmates"
        key="inmateProfilePic"
        render={(inmates: Inmate[]) => (
          <>
            {inmates.map((inmate) => (
              <Avatar
                src={inmate.profileImagePath}
                fallback={genFullName(inmate)}
                size={64}
              />
            ))}
          </>
        )}
      />
      <Table.Column
        title="Incarcerated Person"
        dataIndex="inmates"
        key="inmateInfo"
        render={(inmates: Inmate[]) => (
          <>
            <Space direction="vertical">
              {inmates.map((inmate) => (
                <InmateCell inmate={inmate} navigate={navigate} />
              ))}
            </Space>
          </>
        )}
      />
      <Table.Column
        title=""
        dataIndex="contacts"
        key="contactProfilePic"
        render={(contacts: Contact[]) => (
          <>
            {contacts.map((contact) => (
              <Avatar
                src={contact.profileImagePath}
                fallback={genFullName(contact)}
                size={64}
              />
            ))}
          </>
        )}
      />
      <Table.Column
        title="Contact"
        dataIndex="contacts"
        key="contactInfo"
        render={(contacts: Contact[]) => (
          <>
            <Space direction="vertical">
              {contacts.map((contact) => (
                <ContactCell contact={contact} navigate={navigate} />
              ))}
            </Space>
          </>
        )}
      />
      <Table.Column
        title="Scheduled Start"
        dataIndex="scheduledStart"
        key="scheduledStart"
        render={(scheduledStart: ISOString) => (
          <>
            <Typography.Text>
              {format(new Date(scheduledStart), "MM/dd/y H:mm")}
            </Typography.Text>
          </>
        )}
      />
      <Table.Column
        title="Scheduled End"
        dataIndex="scheduledEnd"
        key="scheduledEnd"
        render={(scheduledEnd: ISOString) => (
          <>
            <Typography.Text>
              {format(new Date(scheduledEnd), "MM/dd/y H:mm")}
            </Typography.Text>
          </>
        )}
      />
      <Table.Column title="Kiosk" dataIndex="kioskId" key="kioskId" />
      <Table.Column
        title=""
        key="actions"
        render={(_text, request: Call) => (
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
