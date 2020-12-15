import React, { useEffect, useState } from "react";
import { connect, ConnectedProps, useSelector } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { RootState, selectInmateById } from "src/redux";
import Sidebar from "src/components/containers/Sidebar";
import Wrapper from "src/components/containers/Wrapper";
import {
  acceptConnectionRequest,
  declineConnectionRequest,
  selectConnectionRequest,
} from "src/redux/modules/connection_requests";
import SidebarCard from "src/components/cards/SidebarCard";
import { CardType, LoadingTypes } from "src/utils/constants";
import ConnectionRequest from "./ConnectionRequest";
import { WithLoading } from "src/components/hocs/WithLoadingProps";
import Container from "src/components/containers/Container";
import { getConnectionRequests } from "src/api/Connection";

const mapStateToProps = (state: RootState) => ({
  requests: state.requests.requests,
  selected: state.requests.selectedRequest,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
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
  acceptConnectionRequest,
  declineConnectionRequest,
  selectConnectionRequest,
}) => {
  //TODO replace this with appropriate Redux Logic

  const [loading, setLoading] = useState<boolean>(false);
  const inmateInfo = useSelector(
    (state: RootState) => selected && selectInmateById(state, selected.inmateId)
  );

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
    getConnectionRequests();
  }, []);
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
        {selected && inmateInfo && (
          <Container>
            <ConnectionRequestWithLoading
              accept={handleAccept}
              decline={handleDecline}
              contact={selected.contact}
              inmate={inmateInfo}
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
