import React, { ReactElement, useState } from "react";
import { Layout, Menu as AntdMenu, Space, Dropdown, Badge } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  SettingOutlined,
  UserAddOutlined,
  DownOutlined,
  SolutionOutlined,
  SafetyOutlined,
  SearchOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { Facility, SelectedFacility } from "src/typings/Facility";
import "./Menu.css";
import { genFullName } from "src/utils";
import { SIDEBAR_WIDTH } from "src/utils/constants";
import { User } from "src/typings/Session";
import Avatar from "../Avatar";

const { Sider } = Layout;
const { SubMenu } = AntdMenu;

interface Props {
  isLoggedIn: boolean;
  user: User;
  selected: SelectedFacility;
  facilities: Facility[];
  logout: () => void;
  select: (facility: Facility) => void;
  requestsCount: number;
  liveCallsCount: number;
  callRequestsCount: number;
}

export default function Menu({
  isLoggedIn,
  user,
  selected,
  facilities,
  select,
  logout,
  requestsCount,
  liveCallsCount,
  callRequestsCount,
}: Props): ReactElement {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const history = useHistory();
  if (!isLoggedIn) return <div />;

  const headerMenu = (
    <AntdMenu>
      <SubMenu key="sub2" title="Switch Organization">
        {facilities.map((facility) => (
          <AntdMenu.Item key={facility.id} onClick={() => select(facility)}>
            <Space>
              <Avatar fallback={selected.name} size={48} />
              <span>{facility.name}</span>
            </Space>
          </AntdMenu.Item>
        ))}
      </SubMenu>
      <AntdMenu.Item onClick={logout}>
        <span>Log out</span>
      </AntdMenu.Item>
    </AntdMenu>
  );

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(collapsed) => setCollapsed(collapsed)}
      width={SIDEBAR_WIDTH}
    >
      <Dropdown overlay={headerMenu}>
        <Space align="center" className="menu-header">
          <Avatar fallback={selected.name} size={48} />
          {!collapsed && (
            <Space direction="vertical" size={0}>
              <Space align="center">
                <span className="menu-header-facility">{selected.name}</span>
                <DownOutlined style={{ color: "white" }} />
              </Space>
              <span className="menu-header-name">{genFullName(user)}</span>
            </Space>
          )}
        </Space>
      </Dropdown>

      <AntdMenu theme="dark" defaultSelectedKeys={["dash"]}>
        <AntdMenu.Item
          key="dash"
          icon={<PieChartOutlined />}
          onClick={() => history.push("/")}
        >
          Dashboard
        </AntdMenu.Item>
        <AntdMenu.Item
          key="live"
          icon={<DesktopOutlined />}
          onClick={() => history.push("/visitations")}
        >
          Live Video Calls
          <Badge count={liveCallsCount} />
        </AntdMenu.Item>
        <AntdMenu.Item
          key="connection-requests"
          icon={<UserAddOutlined />}
          onClick={() => history.push("/connection-requests")}
        >
          Visitor Requests
          <Badge count={requestsCount} />
        </AntdMenu.Item>
        <AntdMenu.Item
          key="call-requests"
          icon={<VideoCameraAddOutlined />}
          onClick={() => history.push("/call-requests")}
        >
          Visitation Requests
          <Badge count={callRequestsCount} />
        </AntdMenu.Item>
        <AntdMenu.Item
          key="search"
          icon={<SearchOutlined />}
          onClick={() => history.push("/logs")}
        >
          Search for Visits
        </AntdMenu.Item>
        <AntdMenu.Item
          key="staff"
          icon={<SafetyOutlined />}
          onClick={() => history.push("/staff")}
        >
          Staff
        </AntdMenu.Item>
        <AntdMenu.Item
          key="members"
          icon={<TeamOutlined />}
          onClick={() => history.push("/members")}
        >
          Incarcerated People
        </AntdMenu.Item>
        <AntdMenu.Item
          key="visitors"
          icon={<SolutionOutlined />}
          onClick={() => history.push("/visitors")}
        >
          Visitors
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
