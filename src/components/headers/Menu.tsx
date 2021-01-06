import React, { ReactElement, useState } from "react";
import { Layout, Menu as AntdMenu, Breadcrumb } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";

import { RootState } from "src/redux";
import { connect, ConnectedProps } from "react-redux";
import { logout } from "src/redux/modules/user";

const { SubMenu } = AntdMenu;

const { Header, Content, Footer, Sider } = Layout;

interface Props {
  session: SessionState;
  logout: () => void;
}

export default function Menu({ session, logout }: Props): ReactElement {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const history = useHistory();
  if (!session.isLoggedIn) return <div />;

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(collapsed) => setCollapsed(collapsed)}
    >
      <div className="logo" />
      <AntdMenu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
        <AntdMenu.Item
          key="calendar"
          icon={<PieChartOutlined />}
          onClick={() => history.push("/")}
        >
          Dashboard
        </AntdMenu.Item>
        <AntdMenu.Item
          key="calendar"
          icon={<PieChartOutlined />}
          onClick={() => history.push("/calendar")}
        >
          Calendar
        </AntdMenu.Item>
        <AntdMenu.Item
          key="live"
          icon={<DesktopOutlined />}
          onClick={() => history.push("/visitations")}
        >
          Live Video Calls
        </AntdMenu.Item>
        <AntdMenu.Item
          key="requests"
          icon={<UserAddOutlined />}
          onClick={() => history.push("/requests")}
        >
          Approval Requests
        </AntdMenu.Item>
        <AntdMenu.Item
          key="search"
          icon={<UserAddOutlined />}
          onClick={() => history.push("/logs")}
        >
          Search for Visits
        </AntdMenu.Item>
        <AntdMenu.Item
          key="staff"
          icon={<TeamOutlined />}
          onClick={() => history.push("/staff")}
        >
          Staff
        </AntdMenu.Item>
        <AntdMenu.Item
          key="members"
          icon={<TeamOutlined />}
          onClick={() => history.push("/members")}
        >
          Members
        </AntdMenu.Item>

        <AntdMenu.Item
          key="settings"
          icon={<SettingOutlined />}
          onClick={() => history.push("/settings")}
        >
          Settings
        </AntdMenu.Item>
      </AntdMenu>
    </Sider>
  );
}
