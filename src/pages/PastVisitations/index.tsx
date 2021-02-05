import React, { useState, useEffect } from "react";
import { RootState } from "src/redux";
import { connect, ConnectedProps } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { PADDING } from "src/utils/constants";
import { genFullName } from "src/utils/utils";
import { getAllCallsInfo, selectAllCalls } from "src/redux/selectors";
import { format, getDate, getTime } from "date-fns";
import { fetchCalls } from "src/redux/modules/call";
import CallFiltersHeader from "./CallFilters";
import _ from "lodash";
import { Table, Space, Layout, Button, Tag } from "antd";
import Search from "antd/lib/input/Search";
import { push } from "connected-react-router";
import { Connection } from "src/typings/Connection";
import { CallStatus, RecordedCall } from "src/typings/Call";

const { Column } = Table;
const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  logs: getAllCallsInfo(state, selectAllCalls(state)).filter(
    (x) => x.startTime && x.endTime
  ) as RecordedCall[],
  history: state.router,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ fetchCalls, push }, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const LogsContainer: React.FC<PropsFromRedux> = ({
  logs,
  fetchCalls,
  push,
}) => {
  // TODO refactor filter to filter based on store instead of displaying redux data
  // Always call API while waiting
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [global, setGlobal] = useState<string>("");
  const [limit] = useState(100);
  const [offset, setOffset] = useState(0);
  const [startDate, setStartDate] = useState<number>();
  const [endDate, setEndDate] = useState<number>();
  const [maxDuration, setMaxDuration] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

  // const debounceUpdate = useCallback(
  //   _.debounce(() => setGlobal(searchQuery), 1000),
  //   [searchQuery]
  // );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // debounceUpdate();
  };

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
      }))();
    setLoading(false);
  }, [fetchCalls, limit, offset, startDate, endDate, maxDuration, global]);

  return (
    <Content style={{ padding: PADDING }}>
      <Space direction="vertical" style={{ width: "100% " }}>
        <Search
          placeholder="Search by Name, Inmate ID, Facility, Pod ID, ..."
          allowClear
          value={searchQuery}
          onChange={handleSearchChange}
          onSearch={(value) => {
            setGlobal(value);
          }}
        />
        <CallFiltersHeader
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setDuration={setMaxDuration}
        />

        <Table dataSource={logs} loading={loading}>
          <Column
            title="Date"
            dataIndex="startTime"
            key="date"
            render={(time) => (
              <>
                <span>{format(time, "MM/dd/yy")}</span>
              </>
            )}
          />
          <Column
            title="Start Time"
            dataIndex="startTime"
            key="startTime"
            render={(time) => (
              <>
                <span>{format(time, "HH:mm")}</span>
              </>
            )}
          />
          <Column
            title="End Time"
            dataIndex="endTime"
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
                <Button onClick={() => push(`/call/${visitation.id}`)}>
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
