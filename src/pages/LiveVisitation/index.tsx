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
} from "src/redux/modules/live_visitation";
import { CardType } from "src/utils/constants";
import ConnectionDetailsCard from "src/components/cards/ConnectionSnippetCard";
import Sidebar from "src/components/sidebar/Sidebar";
import { genFullName } from "src/utils/utils";

const mapStateToProps = (state: RootState) => ({
  visitations: state.liveVisitations,
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
  >(visitations.visitations);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchQuery(value);

    setFilteredLiveVisitations(
      !value
        ? visitations.visitations
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
    setFilteredLiveVisitations(visitations.visitations);
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

      <section className="main-wrapper">
        <div className="main-container">
          {visitations.selectedVisitation && (
            <LiveVisitationCard visitation={visitations.selectedVisitation} />
          )}
        </div>

        <div></div>

        <div className="main-container">
          {visitations.selectedVisitation && (
            <ConnectionDetailsCard
              connection={visitations.selectedVisitation.connection}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default connector(LiveVisitationContainer);
