import { Form, Popconfirm, Space, Table, Typography } from "antd";
import React from "react";
import { useState } from "react";
import { TableColumn } from "src/typings/Common";
import EditableCell from "./EditableCell";

interface Props {
  originalData: Record<string, any>[];
  columns: TableColumn[];
  onSave: Function;
  onViewItem: (id: number) => void;
}

export default function EditableTable({
  originalData,
  columns,
  onSave,
  onViewItem,
}: Props) {
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
    } catch (err) {
      console.log("Validate Failed:", err);
    }
  };

  const columnsWithEdit = columns.concat([
    {
      title: "",
      dataIndex: "operation",
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Typography.Link onClick={() => save(record.id)}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Typography.Link>Cancel</Typography.Link>
            </Popconfirm>
          </Space>
        ) : (
          <Space>
            <Typography.Link
              disabled={editingId !== null}
              onClick={() => edit(record)}
            >
              Quick Edit
            </Typography.Link>
            <Typography.Link
              disabled={editingId !== null}
              onClick={() => onViewItem(record.id)}
            >
              View Item
            </Typography.Link>
          </Space>
        );
      },
    },
  ]);
  const mergedColumns = columnsWithEdit.map((col) => {
    return col.editable
      ? {
          ...col,
          onCell: (record: any) => ({
            record,
            inputType: "text",
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
          }),
        }
      : col;
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
        columns={mergedColumns as any}
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
}
