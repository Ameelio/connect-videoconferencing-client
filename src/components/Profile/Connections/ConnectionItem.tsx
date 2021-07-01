import { Col, Space, Typography } from "antd";
import React from "react";
import Avatar from "src/components/Avatar";
import { MemberType } from "src/typings/Common";
import { Contact } from "src/typings/Contact";
import { Inmate } from "src/typings/Inmate";
import { genFullName } from "src/utils";

interface Props {
  person: Inmate | Contact;
  relationship: string;
  navigate: (path: string) => void;
  type: MemberType;
}

const ConnectionItem: React.FC<Props> = ({
  person,
  relationship,
  type,
  navigate,
}) => {
  const name = genFullName(person);
  return (
    <Col span={8}>
      <div
        onClick={() =>
          navigate(
            `/${type === "inmate" ? "members" : "contacts"}/${person.id}`
          )
        }
      >
        <Space direction="vertical">
          <Avatar fallback={name} size={48} />
          <Typography.Text>{name}</Typography.Text>
          <Typography.Text type="secondary">{relationship}</Typography.Text>
        </Space>
      </div>
    </Col>
  );
};

export default ConnectionItem;
