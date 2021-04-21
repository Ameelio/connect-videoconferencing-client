import { Space, Typography } from "antd";
import React from "react";
import { Contact } from "src/typings/Contact";
import { genFullName } from "src/utils";

interface Props {
  contact: Contact;
  navigate: (path: string) => void;
}

const ContactCell = ({ contact, navigate }: Props) => {
  return (
    <Space direction="vertical">
      <Typography.Text>Name: {genFullName(contact)}</Typography.Text>
      <Typography.Text>Visitor ID: {contact.id}</Typography.Text>
      <Typography.Link onClick={() => navigate(`/contacts/${contact.id}`)}>
        View Full Profile
      </Typography.Link>
    </Space>
  );
};

export default ContactCell;
