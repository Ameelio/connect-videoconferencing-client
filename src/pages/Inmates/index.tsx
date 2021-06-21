import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { selectAllInmates } from "src/redux/selectors";
import { Layout, Table, Button, Input, Select } from "antd";
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

type TFilter = "firstName" | "lastName" | "inmateIdentification";

const LABEL_TO_FILTER_MAP: Record<TFilter, string> = {
  firstName: "First Name",
  lastName: "Last Name",
  inmateIdentification: "Inmate ID",
};

const UnconnectedInmateContainer: React.FC<PropsFromRedux> = ({
  inmates,
  push,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredInmates, setFilteredInmates] = useState<Inmate[]>([]);
  const [activeSearchFilter, setActiveSearchFilter] = useState<TFilter>(
    "firstName"
  );

  useEffect(() => {
    switch (activeSearchFilter) {
      case "firstName":
        setFilteredInmates(
          inmates.filter((v) => isSubstring(searchQuery, v.firstName))
        );
        break;
      case "lastName":
        setFilteredInmates(
          inmates.filter((v) => isSubstring(searchQuery, v.lastName))
        );
        break;
      case "inmateIdentification":
        setFilteredInmates(
          inmates.filter((v) =>
            isSubstring(searchQuery, v.inmateIdentification)
          )
        );
        break;
      default:
        setFilteredInmates(inmates);
        break;
    }
  }, [activeSearchFilter, searchQuery, inmates]);

  const columns = [
    {
      title: "",
      // dataIndex: "profileImagePath",
      editable: false,
      render: (_text: string, inmate: Inmate) => (
        <>
          <Avatar fallback={genFullName(inmate)} size={48} />
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
          <Input.Group compact>
            <Select
              defaultValue={Object.keys(LABEL_TO_FILTER_MAP)[0] as TFilter}
              onSelect={(value) => setActiveSearchFilter(value as TFilter)}
            >
              {Object.keys(LABEL_TO_FILTER_MAP).map((key) => (
                <Select.Option key={key} value={key as TFilter}>
                  {LABEL_TO_FILTER_MAP[key as TFilter]}
                </Select.Option>
              ))}
            </Select>
            <Input.Search
              style={{ width: "auto" }}
              placeholder={`Search by ${LABEL_TO_FILTER_MAP[activeSearchFilter]}...`}
              allowClear
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
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
