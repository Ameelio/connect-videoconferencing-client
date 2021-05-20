import { Layout, Row, Col } from "antd";
import React from "react";
import { WRAPPER_STYLE } from "src/styles/styles";
import { Call } from "src/typings/Call";
import { MemberType } from "src/typings/Common";
import { Connection } from "src/typings/Connection";
import { Contact } from "src/typings/Contact";
import { IdentificationImages } from "src/typings/IdentificationImage";
import { Inmate } from "src/typings/Inmate";
import ConnectionsList from "./Connections/ConnectionsList";
import ProfileHeader from "./ProfileHeader";
import CallTimeline from "./Timeline";

interface Props {
  calls: Call[];
  type: MemberType;
  connections: Connection[];
  facilityName: string;
  idImages?: IdentificationImages;
  persona: Inmate | Contact;
  navigate: (path: string) => void;
}

const Profile: React.FC<Props> = ({
  calls,
  connections,
  type,
  facilityName,
  idImages,
  persona,
  navigate,
}) => {
  return (
    <Layout>
      <Layout.Content style={WRAPPER_STYLE}>
        <ProfileHeader
          type={type}
          persona={persona}
          facilityName={facilityName}
          idImages={idImages}
        />
        <Row justify="space-between" gutter={12}>
          <Col span={16}>
            <CallTimeline calls={calls} type={type} navigate={navigate} />
          </Col>
          <Col span={8}>
            <ConnectionsList
              connections={connections}
              type={type}
              navigate={navigate}
            />
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
};

export default Profile;
