import { Card, Layout, Tabs, Tree } from "antd";
import { DataNode } from "rc-tree/lib/interface";
import React, { useState } from "react";
import { WRAPPER_STYLE } from "src/styles/styles";
import { SelectedFacility, TentativeCallSlot } from "src/typings/Facility";
import { Kiosk } from "src/typings/Kiosk";
import Header from "../Header";
import CallHourSettings from "./CallHourSettings";
import KioskSettings from "./KioskSettings";

interface Props {
  groups: DataNode[];
  facility: SelectedFacility;
  kiosks: Kiosk[];
  handleCallHoursChange: (callSlots: TentativeCallSlot[]) => void;
}

type TTab = "setting" | "facility" | "kiosks";
const Settings = ({
  groups,
  facility,
  kiosks,
  handleCallHoursChange,
}: Props) => {
  const [activeTab, setActiveTab] = useState<TTab>("setting");

  return (
    <Layout.Content>
      <Header
        title="Settings"
        subtitle="Adjust the call hours, facility information, and facility kiosk directory as needed."
      />
      <div style={WRAPPER_STYLE}>
        <Tabs
          defaultActiveKey={activeTab}
          onChange={(key) => setActiveTab(key as TTab)}
        >
          <Tabs.TabPane tab="General Settings" key="setting">
            <CallHourSettings
              handleSave={handleCallHoursChange}
              callTimes={facility.callTimes}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Facility" key="facility">
            <Card title="Facility Tree">
              <Tree treeData={groups} defaultExpandAll={true} />
            </Card>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Kiosks" key="kiosks">
            <KioskSettings kiosks={kiosks} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Layout.Content>
  );
};

export default Settings;
