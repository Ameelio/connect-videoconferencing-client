import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "src/redux";
import { bindActionCreators, Dispatch } from "redux";
import { updateStaff } from "src/redux/modules/staff";
import { WRAPPER_STYLE } from "src/styles/styles";
import {
  Table,
  Tag,
  Space,
  Layout,
  Avatar,
  Divider,
  Modal,
  Button,
} from "antd";
import { selectAllStaff } from "src/redux/selectors";
import { genFullName } from "src/utils";
import CreateStaffForm, { StaffFormFields } from "./CreateStaffForm";
import Header from "src/components/Header/Header";

const { Column } = Table;
const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  staff: selectAllStaff(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ updateStaff }, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const StaffContainer: React.FC<PropsFromRedux> = ({ staff, updateStaff }) => {
  const [modalType, setModalType] = useState<"create" | "edit" | null>(null);
  const [selected, setSelected] = useState<Staff>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState<StaffFormFields>({
    email: "",
    role: "",
  });

  const handleOk = () => {
    setConfirmLoading(true);
    switch (modalType) {
      case "edit":
        if (selected)
          // updateStaff({
          //   userId: selected.id,
          // });
          break;
      case "create":
        // do somethin
        break;
    }

    setConfirmLoading(false);
  };

  return (
    <Content>
      <Header
        title="Staff"
        subtitle="Manage your staff, edit their access permissions, and add new members."
        // extra={[
        //   <Button
        //     onClick={() => setModalType("create")}
        //     icon={<UserAddOutlined />}
        //   >
        //     Add Staff Member
        //   </Button>,
        // ]}
      />
      <div style={WRAPPER_STYLE}>
        <Table dataSource={staff}>
          <Column
            title=""
            dataIndex="profileImagePath"
            key="profileImagePath"
            render={(img) => (
              <>
                <Avatar src={img} size="large" />
              </>
            )}
          />
          <Column title="First Name" dataIndex="firstName" key="firstName" />
          <Column title="Last Name" dataIndex="lastName" key="lastName" />
          <Column
            title="Role"
            dataIndex="role"
            key="role"
            render={(role) => (
              <>
                <Tag color="blue" key={role}>
                  {role || "Operator"}
                </Tag>
              </>
            )}
          />
          <Column
            title=""
            key="edit"
            render={(_text, record: Staff) => (
              <Button
                onClick={() => {
                  setSelected(record);
                  setModalType("edit");
                }}
              >
                Edit
              </Button>
            )}
          />
        </Table>
      </div>
      {/* </Space> */}
      <Modal
        title="Add Staff"
        visible={modalType === "create"}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setModalType(null)}
      >
        <CreateStaffForm data={formData} onChange={setFormData} />
      </Modal>
      <Modal
        title="Edit Staff"
        visible={modalType === "edit"}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setModalType(null)}
      >
        {selected && (
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <span>Name: {genFullName(selected)}</span>
            <span>Role: {selected.role}</span>
            <span>Email: {selected.email}</span>
            <Divider />
          </Space>
        )}
      </Modal>
    </Content>
  );
};

export default connector(StaffContainer);
