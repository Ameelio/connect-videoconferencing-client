import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "src/redux";
import { bindActionCreators, Dispatch } from "redux";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import SidebarCard from "src/components/cards/SidebarCard";
import LiveVisitationCard from "src/components/cards/LiveVisitationCard";

import {
  loadLiveVisitations,
  selectLiveVisitation,
} from "src/redux/modules/visitation";
import { CardType } from "src/utils/constants";
import ConnectionDetailsCard from "src/components/cards/ConnectionDetailsCard";
import Sidebar from "src/components/containers/Sidebar";
import { genFullName } from "src/utils/utils";
import Container from "src/components/containers/Container";
import Wrapper from "src/components/containers/Wrapper";

const mapStateToProps = (state: RootState) => ({
  visitations: state.visitations,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      loadLiveVisitations,
      selectLiveVisitation,
    },
    dispatch
  );

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const LiveVisitationContainer: React.FC<PropsFromRedux> = ({
  visitations,
  loadLiveVisitations,
  selectLiveVisitation,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredLiveVisitations, setFilteredLiveVisitations] = useState<
    LiveVisitation[]
  >(visitations.liveVisitations);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchQuery(value);

    setFilteredLiveVisitations(
      !value
        ? visitations.liveVisitations
        : filteredLiveVisitations.filter((visitation) => {
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

  useEffect(() => {
    if (!visitations.hasLoaded) loadLiveVisitations();
    setFilteredLiveVisitations(visitations.liveVisitations);
  }, [setFilteredLiveVisitations, visitations, loadLiveVisitations]);

  return (
    <div className="d-flex flex-row">
      <Sidebar title="Live Visitations">
        <Form className="mt-3 w-75">
          <FormControl
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Form>

        {filteredLiveVisitations.map((liveVisitation) => (
          <SidebarCard
            key={liveVisitation.id}
            type={CardType.LiveVisitation}
            entity={liveVisitation}
            isActive={liveVisitation.id === visitations.selectedVisitation?.id}
            handleClick={(e) => selectLiveVisitation(liveVisitation)}
          />
        ))}
      </Sidebar>

      <Wrapper>
        <Container>
          {visitations.selectedVisitation && (
            <LiveVisitationCard visitation={visitations.selectedVisitation} />
          )}
        </Container>

        <div></div>

        <Container>
          {visitations.selectedVisitation && (
            <ConnectionDetailsCard
              connection={visitations.selectedVisitation.connection}
            />
          )}
        </Container>
      </Wrapper>
    </div>
  );
};

export default connector(LiveVisitationContainer);
