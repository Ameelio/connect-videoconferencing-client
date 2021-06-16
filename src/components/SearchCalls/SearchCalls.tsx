import { Input, Layout, Select } from "antd";
import React, { useState, useCallback, useEffect } from "react";
import CallFiltersHeader from "src/pages/CallLogs/CallFilters";
import { WRAPPER_STYLE } from "src/styles/styles";
import { Call, CallFilters, CallStatus, SearchFilter } from "src/typings/Call";
import { isSubstring } from "src/utils";
import Header from "../Header";
import SearchCallsTable from "./SearchCallsTable";
import _ from "lodash";
import {
  CALL_STATUS_FILTER_OPTIONS,
  VISIATION_TYPE_LABEL_MAP,
  VISITATION_TYPE_FILTER_OPTIONS,
} from "src/constants";
import { VisitationType } from "src/typings/Common";

interface Props {
  calls: Call[];
  navigate: (path: string) => void;
  fetchCalls: (filters: CallFilters) => void;
  openCancelCallModal: (call: Call) => void;
}

const LABEL_TO_FILTER_MAP: Record<SearchFilter, string> = {
  "inmateParticipants.inmateIdentification": "Inmate ID",
  "inmateParticipants.lastName": "Inmate Last Name",
  "userParticipants.lastName": "Contact Name",
  "userParticipants.id": "Contact ID",
  "kiosk.name": "Kiosk",
  status: "Status",
  // type: "Type",
};

const SearchCalls = ({
  calls,
  navigate,
  fetchCalls,
  openCancelCallModal,
}: Props) => {
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
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<
    CallStatus[]
  >([]);

  const [selectedVisitationType, setSelectedVisitationType] = useState<
    VisitationType
  >();

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
        // type: selectedVisitationType,
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
    selectedVisitationType,
  ]);

  useEffect(() => {
    let filteredCalls = calls;

    if (startDate && endDate)
      filteredCalls = filteredCalls.filter(
        (log) =>
          new Date(log.scheduledStart) >= new Date(startDate) &&
          new Date(log.scheduledStart) <= new Date(endDate)
      );

    // Free Text Filters
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
            log.contacts.some((contact) => contact.id === searchQuery)
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

    // Multiple Choice Filters
    // if (activeSearchFilter === "type" && selectedVisitationType) {
    //   filteredCalls = filteredCalls.filter(
    //     (call) => call.type === selectedVisitationType
    //   );
    // }
    if (activeSearchFilter === "status" && selectedStatusFilter.length) {
      filteredCalls = filteredCalls.filter((call) =>
        selectedStatusFilter.includes(call.status)
      );
    }

    setFilteredLogs(filteredCalls);
  }, [
    calls,
    setFilteredLogs,
    startDate,
    endDate,
    activeSearchFilter,
    searchQuery,
    selectedStatusFilter,
    selectedVisitationType,
  ]);

  const filteredOptions = CALL_STATUS_FILTER_OPTIONS.filter(
    (c) => !selectedStatusFilter.includes(c.value)
  );

  const filteredVisitationTypeOptions = VISITATION_TYPE_FILTER_OPTIONS.filter(
    (type) => selectedVisitationType !== type.value
  );

  const renderSelectFilter = () => {
    switch (activeSearchFilter) {
      case "status":
        return (
          <Select
            mode="multiple"
            allowClear
            style={{ width: "auto", minWidth: 150 }}
            placeholder="Filter by call status"
            onChange={(value) => setSelectedStatusFilter(value as CallStatus[])}
          >
            {filteredOptions.map((o) => (
              <Select.Option key={o.key} value={o.value}>
                {o.label}
              </Select.Option>
            ))}
          </Select>
        );
      // case "type":
      //   return (
      //     <Select
      //       allowClear
      //       style={{ width: "auto", minWidth: 150 }}
      //       placeholder="Filter by visitation type"
      //       onChange={(value) => {
      //         setSelectedVisitationType(value as VisitationType);
      //       }}
      //       value={
      //         selectedVisitationType &&
      //         VISIATION_TYPE_LABEL_MAP[selectedVisitationType]
      //       }
      //     >
      //       {filteredVisitationTypeOptions.map((o) => (
      //         <Select.Option key={o.key} value={o.value}>
      //           {o.label}
      //         </Select.Option>
      //       ))}
      //     </Select>
      //   );
      default:
        return <div />;
    }
  };

  return (
    <Layout.Content>
      <Header
        title="Search for Visitation Logs"
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
            {activeSearchFilter === "status" ? (
              renderSelectFilter()
            ) : (
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
            )}
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
          openCancelCallModal={openCancelCallModal}
        />
      </div>
    </Layout.Content>
  );
};

export default SearchCalls;
