import React, { useState, useEffect, useCallback } from "react";
import { RootState } from "src/redux";
import { connect, ConnectedProps } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { FULL_WIDTH, WRAPPER_STYLE } from "src/styles/styles";
import { genFullName } from "src/utils";
import { getCallsInfo, selectAllCalls } from "src/redux/selectors";
import { format } from "date-fns";
import { fetchCalls } from "src/redux/modules/call";
import CallFiltersHeader from "./CallFilters";
import { Table, Space, Layout, Button, Tag, Input, Select } from "antd";
import { push } from "connected-react-router";
import { CallStatus, Call, SearchFilter, CallFilters } from "src/typings/Call";
import Header from "src/components/Header/Header";
import { EyeOutlined } from "@ant-design/icons";
import _ from "lodash";
import { Inmate } from "src/typings/Inmate";
import { Contact } from "src/typings/Contact";

const { Column } = Table;
const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  logs: getCallsInfo(state, selectAllCalls(state)).filter(
    (call) => call.status === "ended" || call.status === "terminated"
  ) as Call[],
  history: state.router,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ fetchCalls, push }, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const LABEL_TO_FILTER_MAP: Record<SearchFilter, string> = {
  "inmateParticipants.inmateIdentification": "Person ID",
  "inmateParticipants.lastName": "Person Last Name",
  "userParticipants.lastName": "Contact Name",
  "userParticipants.id": "Contact ID",
  "kiosk.name": "Kiosk",
};

const LogsContainer: React.FC<PropsFromRedux> = ({
  logs,
  fetchCalls,
  push,
}) => {
  const [filteredLogs, setFilteredLogs] = useState<Call[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [global, setGlobal] = useState<string>("");
  const [limit] = useState(100);
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
    let filteredCalls = logs;

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
              inmate.inmateIdentification.includes(searchQuery)
            )
          );
          break;
        case "inmateParticipants.lastName":
          filteredCalls = filteredCalls.filter((log) =>
            log.inmates.some((inmate) =>
              genFullName(inmate).includes(searchQuery)
            )
          );
          break;
        case "userParticipants.lastName":
          filteredCalls = filteredCalls.filter((log) =>
            log.contacts.some((contact) =>
              contact.lastName.includes(searchQuery)
            )
          );
          break;
        case "userParticipants.id":
          filteredCalls = filteredCalls.filter((log) =>
            log.contacts.some((contact) => contact.id === parseInt(searchQuery))
          );
          break;
        case "kiosk.name":
          filteredCalls = filteredCalls.filter(
            (call) => call.kiosk.name === searchQuery
          );
          break;
        default:
          break;
      }
    setFilteredLogs(filteredCalls);
  }, [
    logs,
    setFilteredLogs,
    startDate,
    endDate,
    activeSearchFilter,
    searchQuery,
  ]);

  return (
    <Content>
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
      <Space direction="vertical" style={{ ...WRAPPER_STYLE, ...FULL_WIDTH }}>
        <Table dataSource={filteredLogs} loading={loading}>
          <Column
            title="Date"
            dataIndex="scheduledStart"
            key="date"
            render={(time) => (
              <>
                <span>{format(new Date(time), "MM/dd/yy")}</span>
              </>
            )}
          />
          <Column
            title="Start Time"
            dataIndex="scheduledStart"
            key="startTime"
            render={(time) => (
              <>
                <span>{format(new Date(time), "HH:mm")}</span>
              </>
            )}
          />
          <Column
            title="End Time"
            dataIndex="scheduledEnd"
            key="endTime"
            render={(time) => (
              <>
                <span>{format(new Date(time), "HH:mm")}</span>
              </>
            )}
          />
          <Column
            title="Incarcerated Persons"
            dataIndex="inmates"
            key="inmateName"
            render={(inmates: Inmate[]) =>
              inmates.map((inmate) => (
                <>
                  <span>{genFullName(inmate)}</span>
                </>
              ))
            }
          />
          <Column
            title="Unique Identifiers"
            dataIndex="inmates"
            key="inmateIds"
            render={(inmates: Inmate[]) =>
              inmates.map((inmate) => (
                <>
                  <span>{inmate.inmateIdentification}</span>
                </>
              ))
            }
          />
          <Column
            title="Contact Name"
            dataIndex="contacts"
            key="contactName"
            render={(contact: Contact[]) =>
              contact.map((contact) => (
                <>
                  <span>{genFullName(contact)}</span>
                </>
              ))
            }
          />
          <Column
            title="Status"
            dataIndex="status"
            key="location"
            render={(status: CallStatus) => (
              <>
                <Tag>{status}</Tag>
              </>
            )}
          />

          <Column
            title="Recording"
            key="action"
            render={(_text, visitation: Call) => (
              <Space size="middle">
                <Button
                  onClick={() => push(`/call/${visitation.id}`)}
                  icon={<EyeOutlined />}
                >
                  View
                </Button>
              </Space>
            )}
          />
        </Table>
      </Space>
    </Content>
  );
};

export default connector(LogsContainer);
