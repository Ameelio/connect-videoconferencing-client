import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "src/redux";
import { bindActionCreators, Dispatch } from "redux";
import { loadStaff, updateStaff } from "src/redux/modules/staff";
import Wrapper from "src/components/containers/Wrapper";
import SidebarCard from "src/components/cards/SidebarCard";
import { CardType, STAFF_PERMISSION_OPTIONS } from "src/utils/constants";
import Sidebar from "src/components/containers/Sidebar";
import Container from "src/components/containers/Container";
import UserDetailsCard from "src/components/cards/UserDetailsCard";
import { Table, Tag, Space } from "antd";
import { selectAllStaff } from "src/redux/selectors";
import { Image } from "antd";
import { Modal, Button } from "antd";
import { Switch } from "antd";
import { SwitchChangeEventHandler } from "antd/lib/switch";
import { cloneObject, genFullName, mapPermissionMap } from "src/utils/utils";

const { Column } = Table;

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
  const [visible, setVisible] = React.useState(false);
  const [selected, setSelected] = React.useState<Staff>();
  const [confirmLoading, setConfirmLoading] = React.useState(false);
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
    setVisible(true);
    setSelected(record);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    if (selected)
      await updateStaff({
        userId: selected.id,
        permissions: Object.keys(selectedPermissions).filter(
          (key) => selectedPermissions[key as Permission]
        ) as Permission[],
      });
    setConfirmLoading(false);
    setVisible(false);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  useEffect(() => {
    if (selected)
      setSelectedPermissions(mapPermissionMap(selected.permissions));
  }, [selected]);

  console.log(selected);
  return (
    <div className="d-flex flex-row">
      <Table dataSource={staff}>
        <Column
          title=""
          dataIndex="profileImgPath"
          key="profileImgPath"
          render={(img) => (
            <>
              <Image
                src={img}
                width={40}
                fallback="data:image/png;base64,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"
              />
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
          render={(text, record: Staff) => (
            <Button onClick={() => showModal(record)}>Edit</Button>
          )}
        />
      </Table>
      <Modal
        title="Edit Staff"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
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
    </div>
  );
};

export default connector(StaffContainer);
