import { Form, Popconfirm, Table, Typography } from "antd";
import React from "react";
import { useState } from "react";
import EditableCell from "./EditableCell";

interface Props {
  originalData: any;
  columns: any[];
  onSave: Function;
}

const EditableTable = ({ originalData, columns, onSave }: Props) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originalData);
  const [editingId, setEditingId] = useState(null);

  const isEditing = (record: any) => record.id === editingId;

  const edit = (record: any) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingId(record.id);
  };

  const cancel = () => {
    setEditingId(null);
  };

  const save = async (id: number) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => id === item.id);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        await onSave(newData[index]);
        setData(newData);
        setEditingId(null);
      } else {
        newData.push(row);
        setData(newData);
        setEditingId(null);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columnsWithEdit = columns.concat([
    {
      title: "",
      dataIndex: "operation",
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Typography.Link>Cancel</Typography.Link>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingId !== null}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ]);
  const mergedColumns = columnsWithEdit.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default EditableTable;
