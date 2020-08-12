import React, { useState, useEffect } from "react";
import { RootState } from "src/redux";
import { connect, ConnectedProps } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import Sidebar from "src/components/containers/Sidebar";
import Wrapper from "src/components/containers/Wrapper";
import Container from "src/components/containers/Container";
import {
  loadPastVisitations,
  selectPastVisitation,
  fetchVideoRecording,
} from "src/redux/modules/visitation";
import SidebarCard from "src/components/cards/SidebarCard";
import { CardType, LoadingTypes } from "src/utils/constants";
import ConnectionDetailsCard from "src/components/cards/ConnectionDetailsCard";
import { Form, FormControl } from "react-bootstrap";
import { genFullName } from "src/utils/utils";
import VisitationCard from "src/components/cards/VisitationCard";
import { WithLoading } from "src/components/hocs/WithLoadingProps";

const mapStateToProps = (state: RootState) => ({
  logs: state.visitations.pastVisitations,
  selected: state.visitations.selectedPastVisitation,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    { loadPastVisitations, selectPastVisitation, fetchVideoRecording },
    dispatch
  );

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const VisitationCardWithLoading = WithLoading(VisitationCard);

const LogsContainer: React.FC<PropsFromRedux> = ({
  logs,
  selected,
  loadPastVisitations,
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

  useEffect(() => {
    if (!logs.length) loadPastVisitations();
    setFilteredPastVisitations(logs);
  }, [logs, loadPastVisitations]);

  return (
    <div className="d-flex flex-row">
      <Sidebar title="Past Visitations">
        <Form className="mt-3 w-75">
          <FormControl
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Form>
        {filteredPastVisitations.map((log) => (
          <SidebarCard
            key={log.id}
            type={CardType.PastVisitation}
            entity={log}
            isActive={log.id === selected?.id}
            handleClick={(e) => selectPastVisitation(log)}
          />
        ))}
      </Sidebar>
      {selected && (
        <Wrapper>
          <Container>
            <VisitationCardWithLoading
              loading={loading}
              visitation={selected}
              type={CardType.PastVisitation}
              actionLabel="called"
              handleClick={handleVideoRequest}
              loadingType={LoadingTypes.FetchRecording}
            />
          </Container>
          <Container>
            <ConnectionDetailsCard connection={selected.connection} />
          </Container>
        </Wrapper>
      )}
    </div>
  );
};

export default connector(LogsContainer);
