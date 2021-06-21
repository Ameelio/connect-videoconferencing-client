import { Layout } from "antd";
import React from "react";
import { Contact } from "src/typings/Contact";
import Header from "src/components/Header";
import VisitorTable from "./VisitorTable";

interface Props {
  visitors: Contact[];
  loading?: boolean;
  navigateToProfile: (id: string) => void;
}

const Visitors = (props: Props) => {
  return (
    <Layout.Content>
      <Header
        title="Visitors"
        subtitle="Comprehensive list of all visitors that ever requested a connection with a member of your facility. Includes approved, rejected, and pending review visitors"
      />
      <VisitorTable {...props} />
    </Layout.Content>
  );
};

export default Visitors;
