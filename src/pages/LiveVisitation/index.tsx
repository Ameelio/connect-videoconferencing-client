import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "src/redux";
import { bindActionCreators, Dispatch } from "redux";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import SidebarCard from "src/components/cards/SidebarCard";
import VisitationCard from "src/components/cards/VisitationCard";

import {
  selectLiveVisitation,
  terminateLiveVisitation,
} from "src/redux/modules/visitation";
import { CardType } from "src/utils/constants";
import ConnectionDetailsCard from "src/components/cards/ConnectionDetailsCard";
import Sidebar from "src/components/containers/Sidebar";
import { genFullName } from "src/utils/utils";
import Container from "src/components/containers/Container";
import Wrapper from "src/components/containers/Wrapper";
import { loadLiveVisitations } from "src/api/Visitation";
import io from "socket.io-client";
import { getAllVisitationsInfo } from "src/redux/selectors";
import { Menu, Button, Dropdown } from "antd";

const mapStateToProps = (state: RootState) => ({
  visitations: getAllVisitationsInfo(
    state,
    state.visitations.liveVisitations
  ) as LiveVisitation[],
  selected: state.visitations.selectedVisitation,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      loadLiveVisitations,
      selectLiveVisitation,
      terminateLiveVisitation,
    },
    dispatch
  );

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const LiveVisitationContainer: React.FC<PropsFromRedux> = ({
  visitations,
  selected,
  selectLiveVisitation,
  terminateLiveVisitation,
  loadLiveVisitations,
}) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket>();
  const [visibleCalls, setVisibleCalls] = useState<LiveVisitation[]>([]);
  const [numGridCalls, setNumGridCalls] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredLiveVisitations, setFilteredLiveVisitations] = useState<
    LiveVisitation[]
  >(visitations);

  useEffect(() => {
    loadLiveVisitations();
    setSocket(io.connect("ws://localhost:8000", { transports: ["websocket"] }));
  }, [loadLiveVisitations]);

  const OPTIONS = [1, 3, 6, 12];
  const GridMenu = (
    <Menu>
      {OPTIONS.map((option) => (
        <Menu.Item>
          <span onClick={() => setNumGridCalls(option)}>{option}</span>
        </Menu.Item>
      ))}
    </Menu>
  );

  useEffect(() => {
    setVisibleCalls(visitations.slice(0, numGridCalls));
  }, [numGridCalls, visitations]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchQuery(value);

    setFilteredLiveVisitations(
      !value
        ? visitations
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

  const handleVideoTermination = () => {
    selected && terminateLiveVisitation(selected);
  };

  useEffect(() => {
    // if (!visitations.hasLoaded) loadLiveVisitations();
    setFilteredLiveVisitations(visitations);
  }, [setFilteredLiveVisitations, visitations]);

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
            isActive={liveVisitation.id === selected?.id}
            handleClick={(e) => selectLiveVisitation(liveVisitation)}
          />
        ))}
      </Sidebar>

      {socket && (
        <Wrapper>
          <Container>
            <Dropdown overlay={GridMenu} placement="bottomLeft">
              <Button>{numGridCalls}</Button>
            </Dropdown>
            <div className="d-flex flex-column">
              {visibleCalls.map((visibleCall) => (
                <VisitationCard
                  socket={socket}
                  type={CardType.LiveVisitation}
                  visitation={visibleCall}
                  actionLabel="calling"
                  handleClick={handleVideoTermination}
                />
              ))}
            </div>
          </Container>

          <div></div>

          <Container>
            {/* <ConnectionDetailsCard connection={selected.connection} /> */}
          </Container>
        </Wrapper>
      )}
    </div>
  );
};

export default connector(LiveVisitationContainer);
