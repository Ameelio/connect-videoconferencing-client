import React, { useState } from "react";
import { Table, Space, Layout, Avatar, Button, Tabs } from "antd";
import Header from "src/components/Header/Header";
import { Connection } from "src/typings/Connection";
import { Call } from "src/typings/Call";
import { Inmate } from "src/typings/Inmate";
import { WRAPPER_STYLE } from "src/styles/styles";
import ConnectionRequests from "./ConnectionRequests";
import { CallRequests } from "./CallRequests";

const { Column } = Table;
const { Content } = Layout;

interface Props {
  connections: Connection[];
  acceptConnection: (connection: Connection) => void;
  rejectConnection: (connection: Connection) => void;
  calls: Call[];
  acceptCall: (call: Call) => void;
  rejectCall: (call: Call) => void;
}

type TTab = "connections" | "calls";

const Requests = ({
  connections,
  acceptConnection,
  rejectConnection,
  calls,
  acceptCall,
  rejectCall,
}: Props) => {
  const [activeTab, setActiveTab] = useState<TTab>("connections");

  return (
    <Content>
      <Header
        title="Approval Requests"
        subtitle="Review all connection requests between incarcerated people in your facility and their loved one on the outside."
      />
      <Tabs
        style={WRAPPER_STYLE}
        defaultActiveKey={activeTab}
        onChange={(tab: string) => setActiveTab(tab as TTab)}
      >
        <Tabs.TabPane tab="Connections" key="connections">
          <ConnectionRequests
            connections={connections}
            accept={acceptConnection}
            reject={rejectConnection}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Calls" key="calls">
          <CallRequests calls={calls} accept={acceptCall} reject={rejectCall} />
        </Tabs.TabPane>
      </Tabs>
    </Content>
  );
};

export default Requests;
