import React, { useEffect, useState } from "react";
import { connect, ConnectedProps, useSelector } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { RootState } from "src/redux";
import Sidebar from "src/components/containers/Sidebar";
import Wrapper from "src/components/containers/Wrapper";
import {
  acceptConnectionRequest,
  declineConnectionRequest,
  selectConnectionRequest,
} from "src/redux/modules/connection_requests";
import SidebarCard from "src/components/cards/SidebarCard";
import { CardType, LoadingTypes } from "src/utils/constants";
import ConnectionRequestCard from "./ConnectionRequestCard";
import { WithLoading } from "src/components/hocs/WithLoadingProps";
import Container from "src/components/containers/Container";
import { getConnectionRequests } from "src/api/Connection";
import { selectInmateById, getAllConnectionsInfo } from "src/redux/selectors";

const mapStateToProps = (state: RootState) => ({
  requests: getAllConnectionsInfo(state, state.requests.requests),
  // selected: state.requests.selectedRequest,
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

const ConnectionRequestWithLoading = WithLoading(ConnectionRequestCard);

const ConnectionRequestsContainer: React.FC<PropsFromRedux> = ({
  requests,
  // selected,
  acceptConnectionRequest,
  declineConnectionRequest,
  selectConnectionRequest,
}) => {
  //TODO replace this with appropriate Redux Logic

  const [loading, setLoading] = useState<boolean>(false);

  const handleAccept = (request: BaseConnection): void => {
    acceptConnectionRequest(request);
    setLoading(true);
    setTimeout(function () {
      setLoading(false);
    }, 3000);
  };

  const handleDecline = (request: BaseConnection): void => {
    declineConnectionRequest(request);
  };

  useEffect(() => {
    //TODO, replace this with loading logic
    getConnectionRequests();
  }, []);
  return (
    <div className="d-flex flex-row">
      {/* <Sidebar title={`BaseConnection Requests (${requests.length})`}>
        {requests.map((request) => (
          <SidebarCard
            key={request.id}
            type={CardType.BaseConnection}
            entity={request}
            isActive={request.id === selected?.id}
            handleClick={(e) => selectConnectionRequest(request)}
          />
        ))}
      </Sidebar> */}
      <Wrapper>
        {requests.map((request) => (
          <ConnectionRequestWithLoading
            accept={() => handleAccept(request)}
            decline={() => handleDecline(request)}
            contact={request.contact}
            inmate={request.inmate}
            loading={loading}
            loadingType={LoadingTypes.AcceptConnection}
          />
        ))}
      </Wrapper>
    </div>
  );
};

export default connector(ConnectionRequestsContainer);
