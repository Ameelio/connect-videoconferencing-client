import { Input, Layout, Select } from "antd";
import React, { useState, useCallback, useEffect } from "react";
import CallFiltersHeader from "src/pages/CallLogs/CallFilters";
import { WRAPPER_STYLE } from "src/styles/styles";
import { Call, CallFilters, SearchFilter } from "src/typings/Call";
import { isSubstring } from "src/utils";
import Header from "../Header";
import SearchCallsTable from "./SearchCallsTable";
import _ from "lodash";

interface Props {
  calls: Call[];
  navigate: (path: string) => void;
  fetchCalls: (filters: CallFilters) => void;
}

const LABEL_TO_FILTER_MAP: Record<SearchFilter, string> = {
  "inmateParticipants.inmateIdentification": "Person ID",
  "inmateParticipants.lastName": "Person Last Name",
  "userParticipants.lastName": "Contact Name",
  "userParticipants.id": "Contact ID",
  "kiosk.name": "Kiosk",
};

const SearchCalls = ({ calls, navigate, fetchCalls }: Props) => {
  const [filteredLogs, setFilteredLogs] = useState<Call[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [global, setGlobal] = useState<string>("");
  const [limit] = useState(500);
  const [offset] = useState(0);
  const [startDate, setStartDate] = useState<number>();
  const [endDate, setEndDate] = useState<number>();
  const [maxDuration, setMaxDuration] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeSearchFilter, setActiveSearchFilter] = useState<SearchFilter>(
    "inmateParticipants.inmateIdentification"
  );

  const delayedQuery = useCallback(
    _.debounce(() => setGlobal(searchQuery), 1000),
    [searchQuery]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    delayedQuery();
    return delayedQuery.cancel;
  }, [searchQuery, delayedQuery]);

  useEffect(() => {
    setLoading(true);
    (async () =>
      fetchCalls({
        [`${activeSearchFilter}` as keyof CallFilters]: global,
        scheduledStart:
          startDate && endDate
            ? { rangeStart: startDate, rangeEnd: endDate }
            : undefined,
        maxDuration,
        limit,
        offset,
      }))().then(() => setLoading(false));
  }, [
    fetchCalls,
    limit,
    offset,
    startDate,
    endDate,
    maxDuration,
    global,
    activeSearchFilter,
  ]);

  useEffect(() => {
    let filteredCalls = calls;

    if (startDate && endDate)
      filteredCalls = filteredCalls.filter(
        (log) =>
          new Date(log.scheduledStart) >= new Date(startDate) &&
          new Date(log.scheduledStart) <= new Date(endDate)
      );

    if (searchQuery)
      switch (activeSearchFilter) {
        case "inmateParticipants.inmateIdentification":
          filteredCalls = filteredCalls.filter((log) =>
            log.inmates.some((inmate) =>
              isSubstring(searchQuery, inmate.inmateIdentification)
            )
          );
          break;
        case "inmateParticipants.lastName":
          filteredCalls = filteredCalls.filter((log) =>
            log.inmates.some((inmate) =>
              isSubstring(searchQuery, inmate.lastName)
            )
          );
          break;
        case "userParticipants.lastName":
          filteredCalls = filteredCalls.filter((log) =>
            log.contacts.some((contact) =>
              isSubstring(searchQuery, contact.lastName)
            )
          );
          break;
        case "userParticipants.id":
          filteredCalls = filteredCalls.filter((log) =>
            log.contacts.some((contact) => contact.id === parseInt(searchQuery))
          );
          break;
        case "kiosk.name":
          filteredCalls = filteredCalls.filter((call) =>
            isSubstring(searchQuery, call.kiosk.name)
          );
          break;
        default:
          break;
      }
    setFilteredLogs(filteredCalls);
  }, [
    calls,
    setFilteredLogs,
    startDate,
    endDate,
    activeSearchFilter,
    searchQuery,
  ]);

  return (
    <Layout.Content>
      <Header
        title="Search for Call Logs"
        subtitle="Search by different parameters and retrieve recordings of past calls"
        extra={[
          <Input.Group compact>
            <Select
              defaultValue={Object.keys(LABEL_TO_FILTER_MAP)[0] as SearchFilter}
              onSelect={(value) => setActiveSearchFilter(value)}
            >
              {Object.keys(LABEL_TO_FILTER_MAP).map((key) => (
                <Select.Option key={key} value={key as SearchFilter}>
                  {LABEL_TO_FILTER_MAP[key as SearchFilter]}
                </Select.Option>
              ))}
            </Select>
            <Input.Search
              style={{ width: "auto" }}
              placeholder={`Search by ${LABEL_TO_FILTER_MAP[activeSearchFilter]}...`}
              allowClear
              value={searchQuery}
              onChange={handleSearchChange}
              onSearch={(value) => {
                setGlobal(value);
              }}
            />
          </Input.Group>,
          <CallFiltersHeader
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setDuration={setMaxDuration}
          />,
        ]}
      />
      <div style={WRAPPER_STYLE}>
        <SearchCallsTable
          calls={filteredLogs}
          isLoading={loading}
          navigate={navigate}
        />
      </div>
    </Layout.Content>
  );
};

export default SearchCalls;
