import React, { ReactElement } from "react";
import { RootState } from "src/redux";
import { connect, ConnectedProps, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import {
  getCallsInfo,
  selectContactById,
  selectInmateCallsById,
} from "src/redux/selectors";
import { push } from "connected-react-router";
import { useContactConnections } from "src/hooks/useConnections";
import Profile from "src/components/Profile";

type TParams = { id: string };

const mapStateToProps = (
  state: RootState,
  ownProps: RouteComponentProps<TParams>
) => ({
  calls: getCallsInfo(
    state,
    selectInmateCallsById(state, parseInt(ownProps.match.params.id)) || []
  ),
});

const mapDispatchToProps = { push };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function ContactPage({
  calls,
  match,
}: PropsFromRedux & RouteComponentProps<TParams>): ReactElement {
  const facilityName = useSelector(
    (state: RootState) => state.facilities.selected?.name
  );

  const contact = useSelector((state: RootState) =>
    selectContactById(state, match.params.id)
  );
  const connections = useContactConnections(contact?.id || -1);

  if (!contact || !facilityName) return <div />;

  return (
    <Profile
      connections={connections}
      persona={contact}
      facilityName={facilityName}
      calls={calls}
      type="contact"
    />
  );
}

export default connector(ContactPage);
