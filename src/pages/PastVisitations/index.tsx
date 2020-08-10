import React from "react";
import { RootState } from "src/redux";
import { connect, ConnectedProps } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import Sidebar from "src/components/containers/Sidebar";
import Wrapper from "src/components/containers/Wrapper";
import Container from "src/components/containers/Container";
import {
  loadPastVisitations,
  selectPastVisitation,
} from "src/redux/modules/visitation";
import SidebarCard from "src/components/cards/SidebarCard";
import { CardType } from "src/utils/constants";
import ConnectionDetailsCard from "src/components/cards/ConnectionDetailsCard";

const mapStateToProps = (state: RootState) => ({
  logs: state.visitations.pastVisitations,
  selected: state.visitations.selectedPastVisitation,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ loadPastVisitations, selectPastVisitation }, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const LogsContainer: React.FC<PropsFromRedux> = ({
  logs,
  selected,
  loadPastVisitations,
  selectPastVisitation,
}) => {
  if (!logs.length) loadPastVisitations();
  return (
    <div className="d-flex flex-row">
      <Sidebar title="Past Visitations">
        {logs.map((log) => (
          <SidebarCard
            key={log.id}
            type={CardType.PastVisitation}
            entity={log}
            isActive={log.id === selected?.id}
            handleClick={(e) => selectPastVisitation(log)}
          />
        ))}
      </Sidebar>
      <Wrapper>
        <Container>
          {selected && (
            <ConnectionDetailsCard connection={selected.connection} />
          )}
        </Container>
      </Wrapper>
    </div>
  );
};

export default connector(LogsContainer);
