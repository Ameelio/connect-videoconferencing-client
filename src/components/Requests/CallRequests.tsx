import React from "react";
import { Table, Space, Button, Typography } from "antd";
import { format } from "date-fns";
import { genFullName } from "src/utils";
import { Inmate } from "src/typings/Inmate";
import { Contact } from "src/typings/Contact";
import { Call, ISOString } from "src/typings/Call";
import Avatar from "../Avatar";

interface Props {
  calls: Call[];
  accept: (connection: Call) => void;
  reject: (connection: Call) => void;
}

export const CallRequests = ({ calls, accept, reject }: Props) => {
  return (
    <Table dataSource={calls}>
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
                <Space direction="vertical">
                  <span>{genFullName(inmate)}</span>
                  <span>{inmate.inmateIdentification}</span>
                  <span>
                    {format(new Date(inmate.dateOfBirth), "dd/mm/yy")}
                  </span>
                </Space>
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
                <Space direction="vertical">
                  <span>{genFullName(contact)}</span>
                  <span>Visitor ID: {contact.id}</span>
                </Space>
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
