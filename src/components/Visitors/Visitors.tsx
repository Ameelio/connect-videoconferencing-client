import { Input, Layout, Select } from "antd";
import React, { useState } from "react";
import { Contact } from "src/typings/Contact";
import Header from "src/components/Header";
import VisitorTable from "./VisitorTable";
import { useEffect } from "react";
import { isSubstring } from "src/utils";

interface Props {
  visitors: Contact[];
  loading?: boolean;
  navigateToProfile: (id: string) => void;
}

type TFilter = "firstName" | "lastName" | "email";

const LABEL_TO_FILTER_MAP: Record<TFilter, string> = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
};

const Visitors = ({ visitors, loading, navigateToProfile }: Props) => {
  const [activeSearchFilter, setActiveSearchFilter] = useState<TFilter>(
    "firstName"
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredVisitors, setFilteredVisitors] = useState<Contact[]>([]);

  useEffect(() => {
    switch (activeSearchFilter) {
      case "firstName":
        setFilteredVisitors(
          visitors.filter((v) => isSubstring(searchQuery, v.firstName))
        );
        break;
      case "lastName":
        setFilteredVisitors(
          visitors.filter((v) => isSubstring(searchQuery, v.lastName))
        );
        break;
      case "email":
        setFilteredVisitors(
          visitors.filter((v) => isSubstring(searchQuery, v.email))
        );
        break;
      default:
        setFilteredVisitors(visitors);
        break;
    }
  }, [activeSearchFilter, searchQuery, visitors]);

  return (
    <Layout.Content>
      <Header
        title="Visitors"
        subtitle="Comprehensive list of all visitors that ever requested a connection with a member of your facility. Includes approved, rejected, and pending review visitors"
        extra={[
          <Input.Group compact>
            <Select
              defaultValue={Object.keys(LABEL_TO_FILTER_MAP)[0] as TFilter}
              onSelect={(value) => setActiveSearchFilter(value as TFilter)}
            >
              {Object.keys(LABEL_TO_FILTER_MAP).map((key) => (
                <Select.Option key={key} value={key as TFilter}>
                  {LABEL_TO_FILTER_MAP[key as TFilter]}
                </Select.Option>
              ))}
            </Select>
            <Input.Search
              style={{ width: "auto" }}
              placeholder={`Search by ${LABEL_TO_FILTER_MAP[activeSearchFilter]}...`}
              allowClear
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </Input.Group>,
        ]}
      />
      <VisitorTable
        visitors={filteredVisitors}
        navigateToProfile={navigateToProfile}
        loading={loading}
      />
    </Layout.Content>
  );
};

export default Visitors;
