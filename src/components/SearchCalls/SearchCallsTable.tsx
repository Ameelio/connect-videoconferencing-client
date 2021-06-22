import { CloseOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Table, Tag } from "antd";
import { format } from "date-fns";
import React from "react";
import { Call, CallStatus } from "src/typings/Call";
import { VisitationType } from "src/typings/Common";
import { Contact } from "src/typings/Contact";
import { Inmate } from "src/typings/Inmate";
import { capitalize, genFullName, getVisitationLabel } from "src/utils";

interface Props {
  calls: Call[];
  isLoading: boolean;
  navigate: (path: string) => void;
  openCancelCallModal: (call: Call) => void;
}

const SearchCallsTable: React.FC<Props> = ({
  calls,
  isLoading,
  navigate,
  openCancelCallModal,
}) => {
  const renderButton = (visitation: Call) => {
    switch (visitation.status) {
      case "scheduled":
        return (
          <Button
            onClick={() => openCancelCallModal(visitation)}
            icon={<CloseOutlined />}
          >
            Cancel
          </Button>
        );
      case "ended":
      case "terminated":
        return (
          <Button
            onClick={() => navigate(`/call/${visitation.id}`)}
            icon={<EyeOutlined />}
          >
            View
          </Button>
        );
      default:
        return <div />;
    }
  };

  return (
    <Table dataSource={calls} loading={isLoading}>
      <Table.Column
        title="Date"
        dataIndex="scheduledStart"
        key="date"
        render={(time) => (
          <>
            <span>{format(new Date(time), "MM/dd/yy")}</span>
          </>
        )}
      />
      <Table.Column
        title="Start Time"
        dataIndex="scheduledStart"
        key="startTime"
        render={(time) => (
          <>
            <span>{format(new Date(time), "HH:mm")}</span>
          </>
        )}
      />
      <Table.Column
        title="End Time"
        dataIndex="scheduledEnd"
        key="endTime"
        render={(time) => (
          <>
            <span>{format(new Date(time), "HH:mm")}</span>
          </>
        )}
      />
      <Table.Column
        title="Incarcerated Persons"
        dataIndex="inmates"
        key="inmateName"
        render={(inmates: Inmate[]) =>
          inmates.map((inmate) => (
            <>
              <span>{genFullName(inmate)}</span>
            </>
          ))
        }
      />
      <Table.Column
        title="Unique Identifiers"
        dataIndex="inmates"
        key="inmateIds"
        render={(inmates: Inmate[]) =>
          inmates.map((inmate) => (
            <>
              <span>{inmate.inmateIdentification}</span>
            </>
          ))
        }
      />
      <Table.Column
        title="Contact Name"
        dataIndex="contacts"
        key="contactName"
        render={(contact: Contact[]) =>
          contact.map((contact) => (
            <>
              <span>{genFullName(contact)}</span>
            </>
          ))
        }
      />
      <Table.Column
        title="Status"
        dataIndex="status"
        key="location"
        render={(status: CallStatus) => (
          <>
            <Tag>{capitalize(status)}</Tag>
          </>
        )}
      />
      <Table.Column
        title="Type of Visitation"
        dataIndex="type"
        key="type"
        render={(type: VisitationType) => (
          <>
            <Tag>{getVisitationLabel(type)}</Tag>
          </>
        )}
      />

      <Table.Column
        title=""
        key="action"
        render={(_text, visitation: Call) => renderButton(visitation)}
      />
    </Table>
  );
};

export default SearchCallsTable;
