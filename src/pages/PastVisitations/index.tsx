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
} from "src/redux/modules/visitation";
import SidebarCard from "src/components/cards/SidebarCard";
import { CardType } from "src/utils/constants";
import ConnectionDetailsCard from "src/components/cards/ConnectionDetailsCard";
import { Form, FormControl } from "react-bootstrap";
import { genFullName } from "src/utils/utils";

const mapStateToProps = (state: RootState) => ({
  logs: state.visitations.pastVisitations,
  selected: state.visitations.selectedPastVisitation,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ loadPastVisitations, selectPastVisitation }, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const LogsContainer: React.FC<PropsFromRedux> = ({
  logs,
  selected,
  loadPastVisitations,
  selectPastVisitation,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredPastVisitations, setFilteredPastVisitations] = useState<
    RecordedVisitation[]
  >(logs);

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

  if (!logs.length) loadPastVisitations();

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
            {/* TODO add the past visitation log once we have the images */}
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
