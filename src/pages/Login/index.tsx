import React, { useState, ReactElement } from "react";
import { RootState } from "src/redux";
import { connect, ConnectedProps } from "react-redux";
import { Input, Layout, Button, Form, Checkbox } from "antd";

// import { ReactComponent as Operator } from "src/assets/avatars/bald.svg";
// import { ReactComponent as Supervisor } from "src/assets/avatars/woman.svg";
// import { ReactComponent as Admin } from "src/assets/avatars/professor.svg";
// import { ReactComponent as Investigator } from "src/assets/avatars/investigator.svg";
// import { OPERATOR, SUPERVISOR, ADMIN, INVESTIGATOR } from "src/data/sample";

import "./index.css";
import { Redirect } from "react-router";
import { loginWithCredentials } from "src/api/User";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  session: state.session,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function LoginContainer({ session }: PropsFromRedux): ReactElement {
  const [error, setError] = useState("");

  if (session.isLoggedIn) return <Redirect to="/" />;

  const onFinish = async (values: any) => {
    try {
      await loginWithCredentials({
        email: values.email,
        password: values.password,
        remember: values.remember,
      });
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const onFinishFailed = (_errorInfo: any) => {
    setError("Invalid email or password");
  };

  return (
    <Content>
      <div className="login-form-container">
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="login-form"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Email is required." }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Password is required." }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Log In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Content>
  );
}

export default connector(LoginContainer);
