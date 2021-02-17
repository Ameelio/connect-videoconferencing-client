import React, { ReactElement, ReactNode } from "react";
import { Typography, Layout, Space, Divider } from "antd";
import { FULL_WIDTH, PADDING } from "src/styles/styles";

interface Props {
  title: string;
  subtitle: string;
  extra?: ReactNode[];
}

const HEADER_STYLE = {
  backgroundColor: "white",
  boxShadow: "0 2px 4px rgb(53 72 88 / 7%",
  marginBottom: "16px",
  paddingTop: "48px",
  paddingBottom: "48px",
  paddingLeft: PADDING,
  paddingRight: PADDING,
  display: "flex",
  alignItems: "center",
  lineHeight: 1.2,
};

export default function Header({
  title,
  subtitle,
  extra,
}: Props): ReactElement {
  return (
    <Layout.Header style={HEADER_STYLE}>
      <Space direction="vertical" style={FULL_WIDTH}>
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          {title}
        </Typography.Title>
        <Typography.Text>{subtitle}</Typography.Text>
        {extra}
      </Space>
    </Layout.Header>
  );
}
