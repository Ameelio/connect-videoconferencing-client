import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/redux";
import RoomClient from "src/pages/LiveVisitation/RoomClient";
import * as mediasoupClient from "mediasoup-client";
import io from "socket.io-client";
import { Menu, Spin, Dropdown, Button } from "antd";
import {
  LockFilled,
  MessageFilled,
  MoreOutlined,
  SettingFilled,
} from "@ant-design/icons";
const { SubMenu } = Menu;

interface Props {
  width: number | string;
  height: number | string;
  callId: number;
  socket: SocketIOClient.Socket;
  handleTermination: () => void;
}

declare global {
  interface Window {
    Debug: any;
  }
}

const menu = (
  <Menu>
    <SubMenu key="sub2" icon={<MessageFilled />} title="Send Alert">
      <Menu.Item key="1">Appropriate clothing</Menu.Item>
      <Menu.Item key="2">Clothing exposure</Menu.Item>
      <Menu.Item key="3">Appropriate undergarments</Menu.Item>
      <Menu.Item key="4">No sheer clothing</Menu.Item>
      <Menu.Item key="5">Clothing no shorter than knee</Menu.Item>
      <Menu.Item key="6">Leggings no shorter than knee</Menu.Item>
    </SubMenu>
    <Menu.Item key="3" icon={<LockFilled />}>
      Lock
    </Menu.Item>
    <Menu.Item key="1" icon={<SettingFilled />}>
      More
    </Menu.Item>
  </Menu>
);

const VideoChat: React.FC<Props> = React.memo(
  ({ width, height, callId, socket, handleTermination }) => {
    const ref = React.createRef<HTMLDivElement>();

    const token = useSelector(
      (state: RootState) => state.session.authInfo.apiToken
    );
    const id = useSelector((state: RootState) => state.session.user.id);

    const [loading, setLoading] = useState(false);

    // Asynchronously load the room
    useEffect(() => {
      setLoading(true);
      if (ref.current) {
        console.log("Reinitializing videochat." + callId);
        (async () => {
          console.log("Connection state", socket.connected);

          if (!socket.connected) {
            console.log("Not connected, so waiting until connected.");
            window.Debug = socket;
            await new Promise((resolve) => socket.on("connect", resolve));
            console.log("OK");
          }

          await new Promise((resolve) => {
            console.log("OK, logging in as", id, token);
            // TODO fetch actual credentials from redux
            socket.emit(
              "authenticate",
              {
                type: "monitor",
                id,
                token,
              },
              resolve
            );
          });

          const rc = new RoomClient(mediasoupClient, socket, callId);
          await rc.init();

          console.log(rc);

          // This will occur whenever we have JUST joined, or whenever
          // a NEW participant arrives.
          rc.on("consume", async (kind: string, stream: MediaStream) => {
            console.log("GOT CONSUME");

            while (!ref.current) {
              await new Promise((resolve) => setTimeout(resolve, 100));
            }

            if (kind === "video") {
              console.log("Got video.");
              const video = document.createElement("video");
              video.srcObject = stream;
              video.style.width = `${width}`;
              video.style.height = `${height}`;
              video.autoplay = true;
              ref.current.appendChild(video);
              setLoading(false);
            }

            // TODO audio as well.
          });
        })();
      }
    }, [callId, id, ref, token, socket, width, height]);

    return (
      <div
        style={{
          width,
          height,
          backgroundColor: "black",
          borderRadius: 4,
        }}
        ref={ref}
      >
        <div></div>
        <Dropdown overlay={menu}>
          <Button>
            <MoreOutlined />
          </Button>
        </Dropdown>
        {loading && (
          <div>
            <Spin />
            <span>Loading video call...</span>
          </div>
        )}
      </div>
    );
  }
);

export default VideoChat;
