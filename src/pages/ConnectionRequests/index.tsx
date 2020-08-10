import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { RootState } from "src/redux";
import Sidebar from "src/components/containers/Sidebar";
import Container from "src/components/containers/Container";
import Wrapper from "src/components/containers/Wrapper";
import {
  loadConnectionRequests,
  acceptConnectionRequest,
  declineConnectionRequest,
  selectConnectionRequest,
} from "src/redux/modules/connection";
import SidebarCard from "src/components/cards/SidebarCard";
import { CardType, CardSize } from "src/utils/constants";
import { Button } from "react-bootstrap";
import UserSnippetCard from "src/components/cards/UserSnippetCard";

const mapStateToProps = (state: RootState) => ({
  requests: state.connections.requests,
  selected: state.connections.selectedRequest,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      loadConnectionRequests,
      acceptConnectionRequest,
      declineConnectionRequest,
      selectConnectionRequest,
    },
    dispatch
  );

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const ConnectionRequestsContainer: React.FC<PropsFromRedux> = ({
  requests,
  selected,
  loadConnectionRequests,
  acceptConnectionRequest,
  declineConnectionRequest,
  selectConnectionRequest,
}) => {
  useEffect(() => {
    //TODO, replace this with loading logic
    if (!requests.length) loadConnectionRequests();
  });
  return (
    <div className="d-flex flex-row">
      <Sidebar title="Connection Requests">
        {requests.map((request) => (
          <SidebarCard
            key={request.id}
            type={CardType.ConnectionRequest}
            entity={request}
            isActive={request.id === selected?.id}
            handleClick={(e) => selectConnectionRequest(request)}
          />
        ))}
      </Sidebar>
      <Wrapper>
        {selected && selected.contact && selected.inmate && (
          <Container>
            <div className="d-flex flex-row w-100 justify-content-evenly my-5">
              <UserSnippetCard
                type={CardType.Inmate}
                entity={selected.inmate}
                size={CardSize.Large}
              />
              <UserSnippetCard
                type={CardType.Contact}
                entity={selected.contact}
                size={CardSize.Large}
              />
            </div>
            <div className="d-flex flex-row my-5">
              <Button
                size="lg"
                onClick={(e) => acceptConnectionRequest(selected)}
              >
                Approve
              </Button>
              <Button
                size="lg"
                variant="light"
                className="ml-3"
                onClick={(e) => declineConnectionRequest(selected)}
              >
                Decline
              </Button>
            </div>
          </Container>
        )}
      </Wrapper>
    </div>
  );
};

export default connector(ConnectionRequestsContainer);
