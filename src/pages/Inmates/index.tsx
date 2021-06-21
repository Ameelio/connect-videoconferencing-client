import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { selectAllInmates } from "src/redux/selectors";
import { Layout, Table, Button, Input } from "antd";
import { RootState } from "src/redux";
import { WRAPPER_STYLE } from "src/styles/styles";
import { push } from "connected-react-router";
import Header from "src/components/Header";
import { Inmate } from "src/typings/Inmate";
import { EyeOutlined } from "@ant-design/icons";
import { genFullName, isSubstring } from "src/utils";
import Avatar from "src/components/Avatar";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredInmates, setFilteredInmates] = useState<Inmate[]>([]);

  useEffect(() => {
    setFilteredInmates(
      searchQuery.length
        ? inmates.filter((i) =>
            isSubstring(searchQuery, i.inmateIdentification)
          )
        : inmates
    );
  }, [inmates, searchQuery]);

  const columns = [
    {
      title: "",
      // dataIndex: "profileImagePath",
      editable: false,
      render: (_text: string, inmate: Inmate) => (
        <>
          <Avatar
            fallback={genFullName(inmate)}
            src={inmate.profileImagePath}
            size={48}
          />
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
      key: "action",
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
        extra={[
          <Input.Group compact className="w-screen">
            <Input.Search
              className="w-1/4"
              placeholder={`Search by Incarcerated Person ID...`}
              allowClear
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={(value) => {
                setSearchQuery(value);
              }}
            />
          </Input.Group>,
        ]}
      />
      <div style={WRAPPER_STYLE}>
        <Table dataSource={filteredInmates} columns={columns} />
      </div>
    </Content>
  );
};

export default connector(UnconnectedInmateContainer);
