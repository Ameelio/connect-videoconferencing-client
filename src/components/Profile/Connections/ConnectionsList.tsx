import { Card, Empty, Row } from "antd";
import React, { useEffect, useState } from "react";
import { MemberType } from "src/typings/Common";
import { Connection } from "src/typings/Connection";
import ConnectionItem from "./ConnectionItem";

interface Props {
  connections: Connection[];
  type: MemberType;
  navigate: (path: string) => void;
}

const ConnectionsList: React.FC<Props> = ({
  connections,
  type,
  navigate,
}: Props) => {
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>(
    []
  );
  const [activeTab, setActiveTab] = useState("active");
  const tabList = [
    {
      key: "active",
      tab: "Active",
    },
    {
      key: "pending",
      tab: "Pending",
    },
    {
      key: "rejected",
      tab: "Rejected",
    },
  ];

  useEffect(() => {
    setFilteredConnections(connections.filter((c) => c.status === activeTab));
  }, [connections, activeTab]);

  return (
    <Card
      title="Connections"
      tabList={tabList}
      activeTabKey={activeTab}
      onTabChange={(key) => setActiveTab(key)}
    >
      {!connections.length && <Empty description="No Connections" />}

      <Row justify="space-between">
        {filteredConnections.map((connection) => {
          const person =
            type === "inmate" ? connection.contact : connection.inmate;
          return (
            <ConnectionItem
              person={person}
              relationship={connection.relationship}
              navigate={navigate}
              type={type}
            />
          );
        })}
      </Row>
    </Card>
  );
};

export default ConnectionsList;
