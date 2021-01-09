import React, { ReactElement, useState } from "react";
import {
  Layout,
  Menu as AntdMenu,
  Row,
  Col,
  Select,
  Avatar,
  Space,
  Dropdown,
} from "antd";
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
import { Facility, SelectedFacility } from "src/typings/Node";
import "./Menu.css";
import { genFullName, getInitials, generateBgColor } from "src/utils/utils";

const { Option } = Select;

const { Sider } = Layout;
const { SubMenu } = AntdMenu;

interface Props {
  session: SessionState;
  selected: SelectedFacility;
  facilities: Facility[];
  logout: () => void;
  select: (facility: Facility) => void;
}

const FacilityAvatar = ({ facility }: { facility: Facility }): JSX.Element => (
  <Avatar
    size="large"
    shape="square"
    style={{ backgroundColor: generateBgColor(facility.name) }}
  >
    {getInitials(facility.name)}
  </Avatar>
);

export default function Menu({
  session,
  selected,
  facilities,
  select,
  logout,
}: Props): ReactElement {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const history = useHistory();
  if (!session.isLoggedIn) return <div />;

  const headerMenu = (
    <AntdMenu>
      <SubMenu key="sub2" title="Switch Organization">
        {facilities.map((facility) => (
          <AntdMenu.Item onClick={() => select(facility)}>
            <Space>
              <FacilityAvatar facility={facility} />
              <span>{facility.name}</span>
            </Space>
          </AntdMenu.Item>
        ))}
      </SubMenu>
      <AntdMenu.Item>
        <a onClick={() => logout()}>Log out</a>
      </AntdMenu.Item>
    </AntdMenu>
  );

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(collapsed) => setCollapsed(collapsed)}
    >
      <Row className="menu-header">
        <Col flex={1}>
          <FacilityAvatar facility={selected} />
        </Col>
        <Col flex={2}>
          <Space direction="vertical">
            <Dropdown overlay={headerMenu} className="menu-header-select">
              <Select
                disabled
                defaultValue={selected.nodeId}
                bordered={false}
                className="menu-select"
              >
                {facilities.map((facility) => (
                  <Option value={facility.nodeId}>{facility.name}</Option>
                ))}
              </Select>
            </Dropdown>
            <span className="menu-header-name">
              {genFullName(session.user)}
            </span>
          </Space>
        </Col>
      </Row>

      {/* </div> */}
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
