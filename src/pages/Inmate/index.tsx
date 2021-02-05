import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { PADDING } from "src/utils/constants";
import { selectAllInmates } from "src/redux/selectors";
import { Layout, Avatar } from "antd";
import EditableTable from "src/components/editable-table/EditableTable";
import { updateInmate } from "src/redux/modules/inmate";
import { RootState } from "src/redux";

const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  inmates: selectAllInmates(state),
});

const mapDispatchToProps = { updateInmate };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const InmateContainer: React.FC<PropsFromRedux> = ({
  updateInmate,
  inmates,
}) => {
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
      <EditableTable
        originalData={inmates}
        columns={columns}
        onSave={(inmate: Inmate) => updateInmate(inmate)}
      />
    </Content>
  );
};

export default connector(InmateContainer);
