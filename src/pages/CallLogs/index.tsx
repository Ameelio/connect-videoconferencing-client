import React from "react";
import { RootState, useAppDispatch, useAppSelector } from "src/redux";
import { connect, ConnectedProps } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { getCallsInfo, selectAllCalls } from "src/redux/selectors";
import { fetchCalls } from "src/redux/modules/call";
import { push } from "connected-react-router";
import { Call } from "src/typings/Call";
import SearchCalls from "src/components/SearchCalls";
import { openModal } from "src/redux/modules/modal";
import { DEFAULT_CALL_REJECTION_REASONS } from "src/constants";
import { useCalls } from "src/hooks/useCalls";

const SearchCallsPage = () => {
  const dispatch = useAppDispatch();
  const calls = useCalls();
  const facility = useAppSelector(
    (state: RootState) => state.facilities.selected
  );

  if (!facility) return <div />;

  return (
    <SearchCalls
      calls={calls}
      facilityName={facility.name}
      fetchCalls={fetchCalls}
      navigate={(path: string) => dispatch(push(path))}
      openCancelCallModal={(call: Call) =>
        dispatch(
          openModal({
            activeType: "CANCEL_CALL_MODAL",
            entity: call,
            reasons: DEFAULT_CALL_REJECTION_REASONS,
            cancellationType: "cancelled",
          })
        )
      }
    />
  );
};

export default SearchCallsPage;
