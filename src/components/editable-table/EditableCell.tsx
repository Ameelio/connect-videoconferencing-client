import { Form, Input, InputNumber } from "antd";
import React from "react";

interface Props {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: string;
  record: any;
  index: number;
}

const EditableCell: React.FC<Props> = ({
  children,
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
