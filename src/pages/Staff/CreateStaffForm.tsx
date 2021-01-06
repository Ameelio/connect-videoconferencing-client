import React, { ReactElement } from "react";
import { Form, Input, Button, Select, Switch } from "antd";
import { UserOutlined, SendOutlined } from "@ant-design/icons";
import { STAFF_PERMISSION_OPTIONS } from "src/utils/constants";

const { Option } = Select;

export interface StaffFormFields {
  email: string;
  role: string;
  permissions: Permission[];
}
interface Props {
  // onFinish: () => void;
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
          <Option value="operator">Operator</Option>
          <Option value="investigator">Investigator</Option>
          <Option value="warden">Warden</Option>
          <Option value="admin">Admin</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        {/* TODO create coomponent for the switches */}
        {Object.keys(STAFF_PERMISSION_OPTIONS).map((key) => (
          <div>
            <span>{STAFF_PERMISSION_OPTIONS[key as Permission]}</span>
            <Switch
              defaultChecked={false}
              checked={data.permissions.includes(key as Permission)}
              onChange={(checked) => {
                if (checked)
                  onChange({
                    ...data,
                    permissions: [...data.permissions, key as Permission],
                  });
                else
                  onChange({
                    ...data,
                    permissions: data.permissions.filter(
                      (permission) => permission !== key
                    ),
                  });
              }}
            />
          </div>
        ))}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
