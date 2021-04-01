import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { selectAllInmates } from "src/redux/selectors";
import { Layout, Avatar, Table, Button } from "antd";
import { RootState } from "src/redux";
import { WRAPPER_STYLE } from "src/styles/styles";
import { push } from "connected-react-router";
import Header from "src/components/Header/Header";
import { Inmate } from "src/typings/Inmate";
import { EyeOutlined } from "@ant-design/icons";

const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  inmates: selectAllInmates(state),
});

const mapDispatchToProps = { push };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedInmateContainer: React.FC<PropsFromRedux> = ({
  inmates,
  push,
}) => {
  const columns = [
    {
      title: "",
      dataIndex: "profileImagePath",
      editable: false,
      render: (img: any) => (
        <>
          <Avatar src={img} size="large" />
        </>
      ),
    },
    {
      title: "Unique ID",
      dataIndex: "inmateIdentification",
      editable: true,
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      editable: true,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      editable: true,
    },
    {
      title: "Location",
      dataIndex: "location",
      editable: true,
    },
    {
      title: "",
      key: "acction",
      editable: false,
      render: (_text: string, inmate: Inmate) => (
        <>
          <Button
            onClick={() => push(`/members/${inmate.id}`)}
            icon={<EyeOutlined />}
          >
            View
          </Button>
        </>
      ),
    },
  ];

  return (
    <Content>
      <Header
        title="Incarcerated People"
        subtitle="Manage the members of your facility, access detailed information, and edit their info as needed."
      />
      <div style={WRAPPER_STYLE}>
        <Table dataSource={inmates} columns={columns} />
      </div>
    </Content>
  );
};

export default connector(UnconnectedInmateContainer);
