import React, { useState, useEffect, useCallback } from "react";
import { RootState } from "src/redux";
import { connect, ConnectedProps } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { FULL_WIDTH, WRAPPER_STYLE } from "src/styles/styles";
import { genFullName } from "src/utils/Common";
import { getCallsInfo, selectAllCalls } from "src/redux/selectors";
import { format } from "date-fns";
import { fetchCalls } from "src/redux/modules/call";
import CallFiltersHeader from "./CallFilters";
import { Table, Space, Layout, Button, Tag, Input, Select } from "antd";
import { push } from "connected-react-router";
import { Connection } from "src/typings/Connection";
import { CallStatus, RecordedCall } from "src/typings/Call";
import Header from "src/components/Header/Header";
import { EyeOutlined } from "@ant-design/icons";
import _ from "lodash";

const { Column } = Table;
const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  logs: getCallsInfo(state, selectAllCalls(state)).filter(
    (call) => call.status === "ended" || call.status === "terminated"
  ) as RecordedCall[],
  history: state.router,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ fetchCalls, push }, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type SearchFilter =
  | "inmateId"
  | "contactName"
  | "contactId"
  | "inmateName"
  | "kioskName";

const LABEL_TO_FILTER_MAP: Record<SearchFilter, string> = {
  inmateId: "Member ID",
  inmateName: "Member Name",
  contactId: "Contact ID",
  contactName: "Contact Name",
  kioskName: "Kiosk Name",
};

const LogsContainer: React.FC<PropsFromRedux> = ({
  logs,
  fetchCalls,
  push,
}) => {
  // TODO refactor filter to filter based on store instead of displaying redux data
  // Always call API while waiting
  const [filteredLogs, setFilteredLogs] = useState<RecordedCall[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [global, setGlobal] = useState<string>("");
  const [limit] = useState(100);
  const [offset] = useState(0);
  const [startDate, setStartDate] = useState<number>();
  const [endDate, setEndDate] = useState<number>();
  const [maxDuration, setMaxDuration] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeSearchFilter, setActiveSearchFilter] = useState<SearchFilter>(
    "inmateId"
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
        query: global,
        startDate,
        endDate,
        minDuration: 0,
        maxDuration,
        limit,
        offset,
      }))().then(() => setLoading(false));
  }, [fetchCalls, limit, offset, startDate, endDate, maxDuration, global]);

  useEffect(() => {
    let tempLogs = logs;

    if (startDate && endDate)
      tempLogs = tempLogs.filter(
        (log) => log.startTime >= startDate && log.startTime <= endDate
      );

    if (searchQuery)
      switch (activeSearchFilter) {
        case "inmateId":
          tempLogs = tempLogs.filter((log) =>
            `${log.connection.inmate.inmateNumber}`.includes(searchQuery)
          );
          break;
        case "inmateName":
          tempLogs = tempLogs.filter((log) =>
            genFullName(log.connection.inmate).includes(searchQuery)
          );
          break;
        case "contactName":
          tempLogs = tempLogs.filter((log) =>
            genFullName(log.connection.contact).includes(searchQuery)
          );
          break;
        case "contactId":
          tempLogs = tempLogs.filter((log) =>
            `${log.connection.contact.id}`.includes(searchQuery)
          );
          break;
        default:
          break;
      }
    setFilteredLogs(tempLogs);
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
              defaultValue="inmateId"
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
            dataIndex="scheduledStartTime"
            key="date"
            render={(time) => (
              <>
                <span>{format(time, "MM/dd/yy")}</span>
              </>
            )}
          />
          <Column
            title="Start Time"
            dataIndex="scheduledStartTime"
            key="startTime"
            render={(time) => (
              <>
                <span>{format(time, "HH:mm")}</span>
              </>
            )}
          />
          <Column
            title="End Time"
            dataIndex="scheduledEndTime"
            key="endTime"
            render={(time) => (
              <>
                <span>{format(time, "HH:mm")}</span>
              </>
            )}
          />
          <Column
            title="Inmate Name"
            dataIndex="connection"
            key="connection"
            render={(connection: Connection) => (
              <>
                <span>{genFullName(connection.inmate)}</span>
              </>
            )}
          />
          <Column
            title="Inmate ID"
            dataIndex="connection"
            key="inmateId"
            render={(connection: Connection) => (
              <>
                <span>{connection.inmate.inmateNumber}</span>
              </>
            )}
          />
          <Column
            title="Contact Name"
            dataIndex="connection"
            key="contactName"
            render={(connection: Connection) => (
              <>
                <span>{genFullName(connection.contact)}</span>
              </>
            )}
          />
          {/* Change this */}
          <Column
            title="Location"
            dataIndex="connection"
            key="location"
            render={(connection: Connection) => (
              <>
                <span>{connection.inmate.location}</span>
              </>
            )}
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
            render={(_text, visitation: RecordedCall) => (
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
