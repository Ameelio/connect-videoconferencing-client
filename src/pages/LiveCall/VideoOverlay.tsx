import React, { ReactElement, useState } from "react";
import "./Video.css";
import { Menu, Dropdown, Button, Modal, Space, Typography } from "antd";
import {
  AudioMutedOutlined,
  AudioOutlined,
  LockFilled,
  MessageFilled,
  MessageOutlined,
  MoreOutlined,
  SettingFilled,
} from "@ant-design/icons";
import { CallAlert } from "src/typings/Call";

const { SubMenu } = Menu;

interface Props {
  alerts: CallAlert[];
  terminateCall: () => void;
  lockCall: () => void;
  muteCall: () => void;
  unmuteCall: () => void;
  emitAlert: (alert: CallAlert) => void;
  isAudioOn: boolean;
  openChat: () => void;
  closeChat: () => void;
  chatCollapsed: boolean;
}

export default function VideoOverlay({
  alerts,
  terminateCall,
  lockCall,
  muteCall,
  unmuteCall,
  isAudioOn,
  openChat,
  closeChat,
  chatCollapsed,
  emitAlert,
}: Props): ReactElement {
  const [selectedAlert, setSelectedAlert] = useState<CallAlert | null>(null);

  const handleConfirmation = () => {
    if (selectedAlert) emitAlert(selectedAlert);
    setSelectedAlert(null);
  };

  const menu = (
    <Menu>
      <SubMenu key="alert" icon={<MessageFilled />} title="Send Alert">
        {alerts.map((alert) => (
          <Menu.Item key={alert.id} onClick={() => setSelectedAlert(alert)}>
            {alert.title}
          </Menu.Item>
        ))}
      </SubMenu>
      <Menu.Item key="lock" icon={<LockFilled />} onClick={() => lockCall()}>
        Lock
      </Menu.Item>
      <Menu.Item
        key="terminate"
        icon={<SettingFilled />}
        onClick={terminateCall}
      >
        Terminate Call
      </Menu.Item>
      <Menu.Item
        key="mute"
        icon={isAudioOn ? <AudioMutedOutlined /> : <AudioOutlined />}
        onClick={() => (isAudioOn ? muteCall() : unmuteCall())}
      >
        {isAudioOn ? "Mute" : "Unmute"}
      </Menu.Item>
      <Menu.Item
        key="chat"
        icon={chatCollapsed ? <MessageOutlined /> : <MessageOutlined />}
        onClick={() => (chatCollapsed ? openChat() : closeChat())}
      >
        {chatCollapsed ? "View Chat" : "Close Chat"}
      </Menu.Item>
    </Menu>
  );

  return (
    <Space className="video-commands-overlay">
      <Dropdown overlay={menu}>
        <Button>
          <MoreOutlined />
        </Button>
      </Dropdown>
      <Typography.Text></Typography.Text>
      <Modal
        title="Are you sure you want to send this alert?"
        visible={!!selectedAlert}
        onOk={handleConfirmation}
        onCancel={() => setSelectedAlert(null)}
      >
        <p>Send the following alert to the participants:</p>
        <p>{selectedAlert?.body}</p>
      </Modal>
    </Space>
  );
}
