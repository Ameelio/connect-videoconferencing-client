import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { selectAllInmates } from "src/redux/selectors";
import { Layout, Avatar } from "antd";
import EditableTable from "src/components/editable-table/EditableTable";
import { updateInmate } from "src/redux/modules/inmate";
import { RootState } from "src/redux";
import { TableColumn } from "src/typings/Common";
import { WRAPPER_STYLE } from "src/styles/styles";
import { push } from "connected-react-router";
import Header from "src/components/Header/Header";

const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  inmates: selectAllInmates(state),
});

const mapDispatchToProps = { updateInmate, push };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const UnconnectedInmateContainer: React.FC<PropsFromRedux> = ({
  updateInmate,
  inmates,
  push,
}) => {
  const columns: TableColumn[] = [
    {
      title: "",
      dataIndex: "profileImgPath",
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
  ];

  return (
    <Content>
      <Header
        title="Incarcerated People"
        subtitle="Manage the members of your facility, access detailed information, and edit their info as needed."
      />
      <div style={WRAPPER_STYLE}>
        <EditableTable
          originalData={inmates}
          columns={columns}
          onSave={(inmate: Inmate) => updateInmate(inmate)}
          onViewItem={(id: number) => push(`/members/${id}`)}
        />
      </div>
    </Content>
  );
};

export default connector(UnconnectedInmateContainer);
