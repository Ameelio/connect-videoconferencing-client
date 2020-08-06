import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "src/redux";
import { bindActionCreators, Dispatch } from "redux";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import SidebarCard from "src/components/cards/SidebarCard";
import VideoConference from "src/components/videoconference/JitsiMeet";

import {
  loadLiveVisitations,
  selectLiveVisitation,
} from "src/redux/modules/live_visitation";
import { CardType } from "src/data/utils/constants";

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

  useEffect(() => {
    if (!visitations.hasLoaded) loadLiveVisitations();
  });
  return (
    <div className="d-flex flex-row">
      <section className="left-sidebar">
        <span className="p3">Live Visitations</span>

        <Form className="mt-3 w-75">
          <FormControl
            type="text"
            placeholder="Search kiosk"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Form>

        {visitations.visitations.map((liveVisitation) => (
          <SidebarCard
            key={liveVisitation.id}
            type={CardType.Kiosk}
            entity={liveVisitation}
            isActive={liveVisitation.id === visitations.selectedVisitation?.id}
            handleClick={(e) => selectLiveVisitation(liveVisitation)}
          />
        ))}
      </section>

      <section className="main-wrapper">
        <div className="main-container">
          <span className="p3 font-weight-bold">
            Kiosk #{visitations.selectedVisitation.kioskId}
          </span>
          <VideoConference />
        </div>

        <div></div>
      </section>
    </div>
  );
};

export default connector(LiveVisitationContainer);
