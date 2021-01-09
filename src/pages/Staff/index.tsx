import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "src/redux";
import { bindActionCreators, Dispatch } from "redux";
import { loadStaff, updateStaff } from "src/redux/modules/staff";
import Wrapper from "src/components/containers/Wrapper";
import SidebarCard from "src/components/cards/SidebarCard";
import {
  CardType,
  PADDING,
  STAFF_PERMISSION_OPTIONS,
} from "src/utils/constants";
import Sidebar from "src/components/containers/Sidebar";
import Container from "src/components/containers/Container";
import UserDetailsCard from "src/components/cards/UserDetailsCard";
import { Table, Tag, Space, Layout, Avatar, Divider } from "antd";
import { selectAllStaff } from "src/redux/selectors";
import { Image } from "antd";
import { Modal, Button } from "antd";
import { Switch } from "antd";
import { SwitchChangeEventHandler } from "antd/lib/switch";
import { cloneObject, genFullName, mapPermissionMap } from "src/utils/utils";
import CreateStaffForm, { StaffFormFields } from "./CreateStaffForm";

const { Column } = Table;
const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  staff: selectAllStaff(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ loadStaff, updateStaff }, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const StaffContainer: React.FC<PropsFromRedux> = ({
  staff,
  updateStaff,
  loadStaff,
}) => {
  const [modalType, setModalType] = useState<"create" | "edit" | null>(null);
  const [selected, setSelected] = useState<Staff>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState<StaffFormFields>({
    email: "",
    role: "",
    permissions: [],
  });
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<Permission, boolean>
  >({
    allowRead: false,
    allowCalltimes: false,
    allowApproval: false,
    allowRestructure: false,
    allowMonitor: false,
  });

  // create d
  const showModal = (record: Staff) => {
    setSelected(record);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    switch (modalType) {
      case "edit":
        if (selected)
          updateStaff({
            userId: selected.id,
            permissions: Object.keys(selectedPermissions).filter(
              (key) => selectedPermissions[key as Permission]
            ) as Permission[],
          });
        break;
      case "create":
        // do somethin
        break;
    }

    setConfirmLoading(false);
  };

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  useEffect(() => {
    if (selected)
      setSelectedPermissions(mapPermissionMap(selected.permissions));
  }, [selected]);

  return (
    <Content style={{ padding: PADDING }}>
      {/* <Space align="end" direction="vertical" style={{ flex: 1 }}> */}
      <Button type="primary" onClick={() => setModalType("create")}>
        Add
      </Button>
      <Divider />

      <Table dataSource={staff}>
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
          <div className="d-flex flex-column">
            <span>{genFullName(selected)}</span>
            <span>{selected.role}</span>
            <span>{selected.email}</span>
            {Object.keys(STAFF_PERMISSION_OPTIONS).map((key) => (
              <div>
                <span>{STAFF_PERMISSION_OPTIONS[key as Permission]}</span>
                <Switch
                  defaultChecked={selected.permissions.includes(
                    key as Permission
                  )}
                  checked={selectedPermissions[key as Permission]}
                  onChange={(checked) => {
                    const update = cloneObject(selectedPermissions) as Record<
                      Permission,
                      boolean
                    >;
                    update[key as Permission] = checked;
                    setSelectedPermissions(update);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </Modal>
    </Content>
  );
};

export default connector(StaffContainer);
