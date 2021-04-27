import React from "react";
import { RootState, useAppDispatch } from "src/redux";
import { connect, ConnectedProps } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { getCallsInfo, selectAllCalls } from "src/redux/selectors";
import { fetchCalls } from "src/redux/modules/call";
import { push } from "connected-react-router";
import { Call } from "src/typings/Call";
import SearchCalls from "src/components/SearchCalls";

const mapStateToProps = (state: RootState) => ({
  logs: getCallsInfo(state, selectAllCalls(state)).filter(
    (call) =>
      call.status === "ended" ||
      call.status === "terminated" ||
      call.status === "scheduled"
  ) as Call[],
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ fetchCalls }, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const SearchCallsPage: React.FC<PropsFromRedux> = ({ logs, fetchCalls }) => {
  const dispatch = useAppDispatch();

  return (
    <SearchCalls
      calls={logs}
      fetchCalls={fetchCalls}
      navigate={(path: string) => dispatch(push(path))}
    />
  );
};

export default connector(SearchCallsPage);
