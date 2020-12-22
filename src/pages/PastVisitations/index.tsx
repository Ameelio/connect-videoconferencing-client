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
import { CardType, LoadingTypes } from "src/utils/constants";
import ConnectionDetailsCard from "src/components/cards/ConnectionDetailsCard";
import {
  Dropdown,
  DropdownButton,
  Form,
  FormControl,
  Table,
} from "react-bootstrap";
import { genFullName } from "src/utils/utils";
import VisitationCard from "src/components/cards/VisitationCard";
import { WithLoading } from "src/components/hocs/WithLoadingProps";
import {
  getAllVisitationsInfo,
  selectAllRecordings,
} from "src/redux/selectors";
import { getVisitations } from "src/api/Visitation";
import { isCatchClause } from "typescript";
import { format, getDate, getTime } from "date-fns";
import { getRecordings } from "src/redux/modules/recording";
import CallFilters from "./CallFilters";
import _ from "lodash";

const mapStateToProps = (state: RootState) => {
  console.log("Calling mapstatetoprops");

  return {
    logs: getAllVisitationsInfo(state, selectAllRecordings(state)).filter(
      (x) => x.startTime && x.endTime
    ) as RecordedVisitation[],
    selected: state.visitations.selectedPastVisitation,
  };
};

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
  const [dateRange, setDateRange] = useState<Date[]>();
  const [duration, setDuration] = useState<number[]>();

  const debounceUpdate = useCallback(
    _.debounce(() => setGlobal(searchQuery), 1000),
    [searchQuery]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    debounceUpdate();
  };

  useEffect(() => {
    (async () => getRecordings(global, dateRange, duration, limit, offset))();
  }, [getRecordings, limit, offset, dateRange, duration, global]);

  const renderItem = (visitation: RecordedVisitation): JSX.Element => {
    console.log("Rendering vistation:", visitation);

    return (
      <tr>
        <td></td>
        <td>{format(visitation.startTime, "MM/dd/yy")}</td>
        <td>{format(visitation.startTime, "HH/mm")}</td>
        <td>{format(visitation.endTime, "HH/mm")}</td>
        <td>{genFullName(visitation.connection.inmate)}</td>
        <td>{visitation.connection.inmate.inmateNumber}</td>
        <td>{genFullName(visitation.connection.contact)}</td>
        <td>{visitation.connection.contact.id}</td>
        <td>Facility</td>
      </tr>
    );
  };

  return (
    <div className="d-flex flex-column">
      <Form className="mt-3 w-100">
        <FormControl
          type="text"
          placeholder="Search by Name, Inmate ID, Facility, Pod ID, ..."
          value={searchQuery}
          onChange={handleSearchChange}
          // onSubmit={handleSubmission}
        />
      </Form>
      <CallFilters setDateRange={setDateRange} setDuration={setDuration} />
      <Container>
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
      </Container>
    </div>
  );
};

export default connector(LogsContainer);
