import React from "react";
import { RootState, useAppDispatch } from "src/redux";
import { connect, ConnectedProps } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { getCallsInfo, selectAllCalls } from "src/redux/selectors";
import { fetchCalls } from "src/redux/modules/call";
import { push } from "connected-react-router";
import { Call } from "src/typings/Call";
import SearchCalls from "src/components/SearchCalls";
import { openModal } from "src/redux/modules/modal";

const mapStateToProps = (state: RootState) => ({
  logs: getCallsInfo(state, selectAllCalls(state)) as Call[],
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
      openCancelCallModal={(call: Call) =>
        dispatch(openModal({ activeType: "CANCEL_CALL_MODAL", entity: call }))
      }
    />
  );
};

export default connector(SearchCallsPage);
