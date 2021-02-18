import React, { ReactElement } from "react";
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
import { loginWithCredentials } from "src/api/Session";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { UI } from "src/utils";

const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  session: state.session,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const TOAST_KEY = "login";

function UnconnectedLoginContainer({ session }: PropsFromRedux): ReactElement {
  if (session.status === "active") {
    UI.showToast(
      TOAST_KEY,
      `Welcome back, ${session.user.firstName}!`,
      "success"
    );
    return <Redirect to={session.redirectUrl} />;
  }

  const onFinish = async (values: any) => {
    UI.showToast(TOAST_KEY, "Authenticating with credentials...", "loading");
    try {
      await loginWithCredentials({
        email: values.email,
        password: values.password,
        remember: values.remember,
      });
    } catch (err) {
      UI.showToast(TOAST_KEY, "Invalid email or password", "error");
    }
  };

  const onFinishFailed = (_errorInfo: any) => {
    UI.showToast(TOAST_KEY, "Invalid email or password", "error");
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
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={session.status === "loading"}
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Content>
  );
}

export default connector(UnconnectedLoginContainer);
