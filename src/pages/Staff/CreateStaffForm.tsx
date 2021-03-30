import React, { ReactElement } from "react";
import { Form, Input, Select } from "antd";
import { SendOutlined } from "@ant-design/icons";

const { Option } = Select;

export interface StaffFormFields {
  email: string;
  role: string;
}
interface Props {
  data: StaffFormFields;
  onChange: (data: StaffFormFields) => void;
}

export default function CreateStaffForm({
  data,
  onChange,
}: Props): ReactElement {
  const [form] = Form.useForm();

  return (
    <Form form={form} name="control-hooks">
      <Form.Item
        name="email"
        label="Email"
        rules={[{ type: "email", required: true }]}
      >
        <Input
          placeholder="Email"
          prefix={<SendOutlined className="site-form-item-icon" />}
          value={data.email}
          onChange={(event) => onChange({ ...data, email: event.target.value })}
        />
      </Form.Item>
      <Form.Item name="gender" label="Role" rules={[{ required: true }]}>
        <Select
          placeholder="Select a role"
          value={data.role}
          onChange={(value) => onChange({ ...data, role: value })}
          allowClear
        >
          <Option value="staff">Staff</Option>
          <Option value="investigator">Investigator</Option>
          <Option value="admin">Admin</Option>
        </Select>
      </Form.Item>
    </Form>
  );
}
