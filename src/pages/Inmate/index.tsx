import React, { ReactElement } from "react";
import { RootState } from "src/redux";
import { connect, ConnectedProps, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import {
  getCallsInfo,
  selectInmateById,
  selectInmateCallsById,
} from "src/redux/selectors";
import { push } from "connected-react-router";
import { useInmateConnections } from "src/hooks/useConnections";
import Profile from "src/components/Profile";

type TParams = { id: string };

const mapStateToProps = (
  state: RootState,
  ownProps: RouteComponentProps<TParams>
) => ({
  inmate: selectInmateById(state, parseInt(ownProps.match.params.id)),
  calls: getCallsInfo(
    state,
    selectInmateCallsById(state, parseInt(ownProps.match.params.id)) || []
  ),
});

const mapDispatchToProps = { push };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function InmatePage({
  inmate,
  calls,
}: PropsFromRedux & RouteComponentProps<TParams>): ReactElement {
  const facilityName = useSelector(
    (state: RootState) => state.facilities.selected?.name
  );

  const connections = useInmateConnections(inmate?.id || -1);

  if (!inmate || !facilityName) return <div />;

  return (
    <Profile
      connections={connections}
      persona={inmate}
      facilityName={facilityName}
      calls={calls}
      type="inmate"
    />
  );
}

export default connector(InmatePage);
