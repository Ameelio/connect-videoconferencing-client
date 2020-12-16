import React, { useState, useEffect } from "react";
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
import { Form, FormControl, Table } from "react-bootstrap";
import { genFullName } from "src/utils/utils";
import VisitationCard from "src/components/cards/VisitationCard";
import { WithLoading } from "src/components/hocs/WithLoadingProps";
import { getAllVisitationsInfo } from "src/redux/selectors";

const mapStateToProps = (state: RootState) => ({
  logs: getAllVisitationsInfo(
    state,
    state.visitations.pastVisitations
  ) as RecordedVisitation[],
  selected: state.visitations.selectedPastVisitation,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ selectPastVisitation, fetchVideoRecording }, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const VisitationCardWithLoading = WithLoading(VisitationCard);

const LogsContainer: React.FC<PropsFromRedux> = ({
  logs,
  selected,
  selectPastVisitation,
  fetchVideoRecording,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredPastVisitations, setFilteredPastVisitations] = useState<
    RecordedVisitation[]
  >(logs);
  //TODO replace this with appropriate Redux Logic
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchQuery(value);

    setFilteredPastVisitations(
      !value
        ? logs
        : logs.filter((visitation) => {
            const { contact, inmate } = visitation.connection;
            return (
              genFullName(contact)
                .toLowerCase()
                .includes(value.toLowerCase()) ||
              genFullName(inmate).toLowerCase().includes(value.toLowerCase())
            );
          })
    );
  };

  const handleVideoRequest = (): void => {
    selected && fetchVideoRecording(selected);
    setLoading(true);
    setTimeout(function () {
      setLoading(false);
    }, 6000);
  };

  const renderItem = (visitation: Visitation): JSX.Element => {
    return (
      <tr>
        <td></td>
        <td>{genFullName(visitation.connection.contact)}</td>
        <td>{genFullName(visitation.connection.inmate)}</td>
      </tr>
    );
  };

  useEffect(() => {
    // if (!logs.length) loadPastVisitations();
    setFilteredPastVisitations(logs);
  }, [logs]);

  return (
    <div className="d-flex">
      <Form className="mt-3 w-100">
        <FormControl
          type="text"
          placeholder="Search by Name, Inmate ID, Facility, Pod ID, ..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Form>
      <Table responsive variant="dark">
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
        {filteredPastVisitations.map(renderItem)}
      </Table>
    </div>
  );
};

export default connector(LogsContainer);
