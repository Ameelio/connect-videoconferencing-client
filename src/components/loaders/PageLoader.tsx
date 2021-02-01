import React, { ReactElement } from "react";
import { Spin, Layout } from "antd";

const { Content } = Layout;

interface Props {}

export default function PageLoader({}: Props): ReactElement {
  return (
    <Content>
      <Spin tip="loading" />
    </Content>
  );
}
