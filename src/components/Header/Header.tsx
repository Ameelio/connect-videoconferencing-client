import React, { ReactElement, ReactNode } from "react";
import { Typography, Layout, Space, Col, Row } from "antd";
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
    <Layout.Header
      style={{
        ...HEADER_STYLE,
        paddingTop: extra?.length ? "72px" : "48px",
        paddingBottom: extra?.length ? "72px" : "48px",
      }}
    >
      <Space direction="vertical" style={FULL_WIDTH}>
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          {title}
        </Typography.Title>
        <Typography.Text>{subtitle}</Typography.Text>
        {extra?.length && (
          <hr
            style={{ border: 0, height: 1, backgroundColor: "rgba(0,0,0,.15)" }}
          />
        )}
        <Row gutter={16}>
          {extra?.map((item) => (
            <Col>{item}</Col>
          ))}
        </Row>
      </Space>
    </Layout.Header>
  );
}
