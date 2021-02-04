import React from "react";
import { useSelector } from "react-redux";
import { PADDING } from "src/utils/constants";
import { selectAllInmates } from "src/redux/selectors";
import { Layout, Avatar } from "antd";
import EditableTable from "src/components/editable-table/EditableTable";

const { Content } = Layout;

const InmateContainer: React.FC = () => {
  const inmates = useSelector(selectAllInmates);

  const columns = [
    {
      title: "",
      dataIndex: "profileImgPath",
      width: "10%",
      editable: false,
      render: (img: any) => (
        <>
          <Avatar src={img} size="large" />
        </>
      ),
    },
    {
      title: "Inmate Number",
      dataIndex: "inmateNumber",
      width: "15%",
      editable: true,
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      width: "25%",
      editable: true,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      width: "25%",
      editable: true,
    },
    {
      title: "Location",
      dataIndex: "location",
      width: "25%",
      editable: true,
    },
  ];

  return (
    <Content style={{ padding: PADDING }}>
      <EditableTable originalData={inmates} columns={columns} />
    </Content>
  );
};

export default InmateContainer;
