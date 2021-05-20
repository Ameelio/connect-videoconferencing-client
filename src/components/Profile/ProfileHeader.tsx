import { Descriptions, Image, PageHeader } from "antd";
import React from "react";
import { MemberType } from "src/typings/Common";
import { Contact } from "src/typings/Contact";
import { Inmate } from "src/typings/Inmate";
import { genFullName } from "src/utils";
import { format } from "date-fns";
import { IdentificationImages } from "src/typings/IdentificationImage";
interface BaseProps {
  facilityName: string;
  idImages?: IdentificationImages;
  type: MemberType;
  persona: Inmate | Contact;
}

// TODO: figure out why this is noot working
// interface InmateProps extends BaseProps {
//   type: "inmate";
//   persona: Inmate;
// }

// interface ContactProps extends BaseProps {
//   type: "contact";
//   persona: Contact;
// }

type Props = BaseProps;

const ProfileHeader: React.FC<Props> = ({
  type,
  facilityName,
  persona,
  idImages,
}) => {
  const routes = [
    {
      path: "/",
      breadcrumbName: facilityName,
    },
    {
      path: "/members",
      breadcrumbName: type === "contact" ? "Visitors" : "Incarcerated People",
    },
    {
      path: "/",
      breadcrumbName: genFullName(persona),
    },
  ];

  const frontId =
    idImages && idImages.frontIdFile ? idImages.frontIdFile.url : "";
  const backId = idImages && idImages.backIdFile ? idImages.backIdFile.url : "";
  const selfieId =
    idImages && idImages.selfieIdFile ? idImages.selfieIdFile.url : "";

  const renderItems = () => {
    switch (type) {
      case "inmate":
        return (
          <Descriptions size="small" column={3} bordered>
            <Descriptions.Item label="First Name">
              {persona.firstName}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name">
              {persona.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Unique ID">
              {(persona as Inmate).inmateIdentification}
            </Descriptions.Item>
            <Descriptions.Item label="DOB">
              {format(new Date((persona as Inmate).dateOfBirth), "yyyy-MM-dd")}
            </Descriptions.Item>
            <Descriptions.Item label="Call Quota">
              {(persona as Inmate).quota}
            </Descriptions.Item>
          </Descriptions>
        );
      case "contact":
        return (
          <Descriptions size="small" column={3} bordered>
            <Descriptions.Item label="First Name">
              {persona.firstName}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name">
              {persona.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name">
              {(persona as Contact).email}
            </Descriptions.Item>
            <Descriptions.Item label="Front ID">
              <Image width={200} src={frontId} />
            </Descriptions.Item>
            <Descriptions.Item label="Back ID">
              <Image width={200} src={backId} />
            </Descriptions.Item>
            <Descriptions.Item label="Selfie">
              <Image width={200} src={selfieId} />
            </Descriptions.Item>
          </Descriptions>
        );
    }
  };

  return (
    <PageHeader
      ghost={false}
      onBack={() => window.history.back()}
      title={genFullName(persona)}
      breadcrumb={{ routes }}
      style={{ marginBottom: 32 }}
    >
      {renderItems()}
    </PageHeader>
  );
};

export default ProfileHeader;
