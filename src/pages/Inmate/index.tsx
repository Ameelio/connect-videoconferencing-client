import React, { ReactElement, useEffect } from "react";
import { RootState, useAppDispatch } from "src/redux";
import { useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { selectInmateById } from "src/redux/selectors";
import { useInmateConnections } from "src/hooks/useConnections";
import Profile from "src/components/Profile";
import { fetchCalls } from "src/redux/modules/call";
import { useInmateCalls } from "src/hooks/useCalls";
import { push } from "connected-react-router";

type TParams = { id: string };

function InmatePage({ match }: RouteComponentProps<TParams>): ReactElement {
  const facilityName = useSelector(
    (state: RootState) => state.facilities.selected?.name
  );

  const inmateId = match.params.id;
  const inmate = useSelector((state: RootState) =>
    selectInmateById(state, inmateId)
  );
  const connections = useInmateConnections(inmate?.id || "");
  const calls = useInmateCalls(inmate?.id || "");

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCalls({ "inmateParticipants.inmateId": inmateId }));
  }, [inmateId, dispatch]);

  if (!inmate || !facilityName) return <div />;

  return (
    <Profile
      connections={connections}
      persona={inmate}
      facilityName={facilityName}
      calls={calls}
      type="inmate"
      navigate={(path: string) => dispatch(push(path))}
    />
  );
}

export default InmatePage;
