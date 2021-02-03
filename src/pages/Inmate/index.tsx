import React, { useState } from "react";
import { useSelector } from "react-redux";
import { PADDING } from "src/utils/constants";
import { selectAllInmates } from "src/redux/selectors";
import { genFullName } from "src/utils/utils";
import {
  Button,
  Table,
  Layout,
  Divider,
  Avatar,
  Modal,
  Space,
  Switch,
} from "antd";

const { Column } = Table;
const { Content } = Layout;

const InmateContainer: React.FC = ({}) => {
  const [modalType, setModalType] = useState<"create" | "edit" | null>(null);
  const [selected, setSelected] = useState<Inmate>();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const inmates = useSelector(selectAllInmates);

  const handleOk = () => {
    setConfirmLoading(true);
    switch (modalType) {
      case "edit":
        if (selected)
          // updateStaff({
          //   userId: selected.id,
          //   permissions: Object.keys(selectedPermissions).filter(
          //     (key) => selectedPermissions[key as Permission]
          //   ) as Permission[],
          // });
          break;
    }

    setConfirmLoading(false);
  };

  return (
    <Content style={{ padding: PADDING }}>
      <Table dataSource={inmates}>
        <Column
          title=""
          dataIndex="profileImgPath"
          key="profileImgPath"
          render={(img) => (
            <>
              <Avatar src={img} size="large" />
            </>
          )}
        />
        <Column
          title="Inmate Number"
          dataIndex="inmateNumber"
          key="inmateNumber"
        />
        <Column title="First Name" dataIndex="firstName" key="firstName" />
        <Column title="Last Name" dataIndex="lastName" key="lastName" />
        <Column title="Location" dataIndex="location" key="location" />
        <Column title="Quota" dataIndex="quota" key="quota" />
        <Column
          title=""
          key="edit"
          render={(_text, record: Inmate) => (
            <Button
              onClick={() => {
                console.log("hey inmate");
                console.log(record);
                setSelected(record);
                setModalType("edit");
              }}
            >
              Edit
            </Button>
          )}
        />
      </Table>
      <Modal
        title="Edit Inmate"
        visible={modalType === "edit"}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setModalType(null)}
      >
        {selected && (
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <span>Inmate Number: {selected.inmateNumber}</span>
            <span>First Name: {selected.firstName}</span>
            <span>Last Name: {selected.lastName}</span>
            <span>Location: {selected.location}</span>
            <span>Quota: {selected.quota}</span>
          </Space>
        )}
      </Modal>
    </Content>
  );
};

export default InmateContainer;
