import React, { useState, useEffect, useCallback } from "react";
import { RootState } from "src/redux";
import { connect, ConnectedProps } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import Sidebar from "src/components/containers/Sidebar";
import Wrapper from "src/components/containers/Wrapper";
import Container from "src/components/containers/Container";
import {
  selectPastVisitation,
  fetchVideoRecording,
} from "src/redux/modules/visitation";
import SidebarCard from "src/components/cards/SidebarCard";
import { CardType, LoadingTypes, PADDING } from "src/utils/constants";
import { genFullName } from "src/utils/utils";
import VisitationCard from "src/components/cards/VisitationCard";
import { WithLoading } from "src/components/hocs/WithLoadingProps";
import {
  getAllVisitationsInfo,
  selectAllRecordings,
} from "src/redux/selectors";
import { isCatchClause } from "typescript";
import { format, getDate, getTime } from "date-fns";
import { getRecordings } from "src/redux/modules/recording";
import CallFiltersHeader from "./CallFilters";
import _ from "lodash";
import { Table, Tag, Space, Layout } from "antd";
import { DownloadOutlined, TeamOutlined } from "@ant-design/icons";
import Search from "antd/lib/input/Search";

const { Column } = Table;
const { Content } = Layout;

const mapStateToProps = (state: RootState) => ({
  logs: getAllVisitationsInfo(
    state,
    selectAllRecordings(state)
  ) as RecordedVisitation[],
  selected: state.visitations.selectedPastVisitation,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ getRecordings, selectPastVisitation }, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const VisitationCardWithLoading = WithLoading(VisitationCard);

const LogsContainer: React.FC<PropsFromRedux> = ({
  logs,
  selected,
  selectPastVisitation,
  getRecordings,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [global, setGlobal] = useState<string>("");
  const [limit] = useState(100);
  const [offset, setOffset] = useState(0);
  const [startDate, setStartDate] = useState<number>();
  const [endDate, setEndDate] = useState<number>();
  const [maxDuration, setMaxDuration] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

  const debounceUpdate = useCallback(
    _.debounce(() => setGlobal(searchQuery), 1000),
    [searchQuery]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    debounceUpdate();
  };

  useEffect(() => {
    setLoading(false);
    (async () =>
      getRecordings({
        query: global,
        startDate,
        endDate,
        minDuration: 0,
        maxDuration,
        limit,
        offset,
      }))();
    setLoading(true);
  }, [getRecordings, limit, offset, startDate, endDate, maxDuration, global]);

  return (
    <Content style={{ padding: PADDING }}>
      <Space direction="vertical" style={{ width: "100% " }}>
        <Search
          placeholder="Search by Name, Inmate ID, Facility, Pod ID, ..."
          allowClear
          value={searchQuery}
          onChange={handleSearchChange}
          onSearch={(value) => {
            setSearchQuery(value);
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
            key="startTime"
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
            key="connection"
            render={(connection: Connection) => (
              <>
                <span>{connection.inmate.inmateNumber}</span>
              </>
            )}
          />
          <Column
            title="Contact Name"
            dataIndex="connection"
            key="connection"
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
            key="connection"
            render={(connection: Connection) => (
              <>
                <span>{connection.inmate.location}</span>
              </>
            )}
          />

          <Column
            title="Recording"
            key="action"
            render={(text, visitation) => (
              <Space size="middle">
                <a>View</a>
              </Space>
            )}
          />
        </Table>
      </Space>
      {/* <Container>
        <Table responsive>
          <thead>
            <tr>
              <th></th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Inmate Name</th>
              <th>Inmate ID</th>
              <th>Visitor Name</th>
              <th>Visitor ID</th>
              <th>Facility</th>
            </tr>
          </thead>
          <tbody>{logs.map(renderItem)}</tbody>
        </Table>
      </Container> */}
    </Content>
  );
};

export default connector(LogsContainer);
