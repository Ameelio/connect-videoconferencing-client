import { Card, Empty, Row } from "antd";
import React from "react";
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
  return (
    <Card title="Connections">
      {!connections.length && <Empty description="No Connections" />}

      <Row justify="space-between">
        {connections.map((connection) => {
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
