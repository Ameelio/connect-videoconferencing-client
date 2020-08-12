import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { RootState } from "src/redux";
import Sidebar from "src/components/containers/Sidebar";
import Wrapper from "src/components/containers/Wrapper";
import {
  loadConnectionRequests,
  acceptConnectionRequest,
  declineConnectionRequest,
  selectConnectionRequest,
} from "src/redux/modules/connection";
import SidebarCard from "src/components/cards/SidebarCard";
import { CardType, LoadingTypes } from "src/utils/constants";
import ConnectionRequest from "./ConnectionRequest";
import { WithLoading } from "src/components/hocs/WithLoadingProps";
import Container from "src/components/containers/Container";

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

const ConnectionRequestWithLoading = WithLoading(ConnectionRequest);

const ConnectionRequestsContainer: React.FC<PropsFromRedux> = ({
  requests,
  selected,
  loadConnectionRequests,
  acceptConnectionRequest,
  declineConnectionRequest,
  selectConnectionRequest,
}) => {
  //TODO replace this with appropriate Redux Logic

  const [loading, setLoading] = useState<boolean>(false);

  const handleAccept = (e: React.MouseEvent): void => {
    selected && acceptConnectionRequest(selected);
    setLoading(true);
    setTimeout(function () {
      setLoading(false);
    }, 3000);
  };

  const handleDecline = (e: React.MouseEvent): void => {
    selected && declineConnectionRequest(selected);
  };

  useEffect(() => {
    //TODO, replace this with loading logic
    if (!requests.length) loadConnectionRequests();
  });
  return (
    <div className="d-flex flex-row">
      <Sidebar title={`Connection Requests (${requests.length})`}>
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
        {selected && (
          <Container>
            <ConnectionRequestWithLoading
              accept={handleAccept}
              decline={handleDecline}
              connection={selected}
              loading={loading}
              loadingType={LoadingTypes.AcceptConnection}
            />
          </Container>
        )}
      </Wrapper>
    </div>
  );
};

export default connector(ConnectionRequestsContainer);
