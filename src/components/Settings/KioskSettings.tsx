import React from "react";
import { Kiosk } from "src/typings/Kiosk";
import { Table, Tag, Card, Switch } from "antd";
import { Dictionary } from "@reduxjs/toolkit";
import { Group } from "src/typings/Group";

interface Props {
  kiosks: Kiosk[];
  groupEnts: Dictionary<Group>;
}

const KioskSettings = ({ kiosks, groupEnts }: Props) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Location",
      dataIndex: "groupId",
      key: "group",
      render: (groupId: number) => (
        <>
          <Tag>{groupEnts[groupId]?.name}</Tag>
        </>
      ),
    },
    {
      title: "Type",
      //   TODO: add this once we add the kiosk type
      // https://github.com/Ameelio/connect-api-nest/issues/93
      //   dataIndex: 'tags',
      key: "type",
      render: () => (
        <>
          <Tag color="orange">Chromebook</Tag>
        </>
      ),
    },
    // TODO: add this once we allow DOCs to enable and disable kiosks
    // https://github.com/Ameelio/connect-doc-client/issues/72
    // When DOC disables kiosk, give them the option to cancel calls
    // {
    //   title: "Enabled",
    //   dataIndex: "enabled",
    //   key: "type",
    //   render: (enabled: boolean) => (
    //     <>
    //       <Switch disabled={true} defaultChecked={enabled} />
    //     </>
    //   ),
    // },
  ];

  return (
    <Card title="Kiosks">
      <Table dataSource={kiosks} columns={columns} />
    </Card>
  );
};

export default KioskSettings;
