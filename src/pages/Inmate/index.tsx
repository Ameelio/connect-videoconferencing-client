import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "src/redux";
import { bindActionCreators, Dispatch } from "redux";
import { loadInmates, selectInmate } from "src/redux/modules/inmate";
import { loadConnections } from "src/redux/modules/connection";
import UserDetailsCard from "src/components/cards/UserDetailsCard";
import { CardType } from "src/utils/constants";
import Container from "src/components/containers/Container";
import Wrapper from "src/components/containers/Wrapper";
import Sidebar from "src/components/containers/Sidebar";
import SidebarCard from "src/components/cards/SidebarCard";
import UserCard from "src/components/cards/UserCard";

const mapStateToProps = (state: RootState) => ({
  inmates: state.inmates.inmates,
  selected: state.inmates.selectedInmate,
  selectedConnections: state.connections.connections.filter(
    (connection) => connection.inmate.id === state.inmates.selectedInmate?.id
  ),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ loadInmates, selectInmate, loadConnections }, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const InmateContainer: React.FC<PropsFromRedux> = ({
  loadInmates,
  selectInmate,
  loadConnections,
  inmates,
  selected,
  selectedConnections,
}) => {
  useEffect(() => {
    //TODO must change this with loading logic
    if (!inmates.length) loadInmates();
    if (!selectedConnections.length) loadConnections();
  });

  return (
    <div className="d-flex flex-row">
      <Sidebar title="Members">
        {inmates.map((inmate) => (
          <SidebarCard
            key={inmate.id}
            type={CardType.Inmate}
            entity={inmate}
            isActive={inmate.id === selected?.id}
            handleClick={(e) => selectInmate(inmate)}
          />
        ))}
      </Sidebar>
      {selected && (
        <Wrapper horizontal>
          <Container></Container>
          <Container>
            <div className="d-flex flex-column">
              <UserDetailsCard type={CardType.Inmate} user={selected} />

              <span className="black-500 mt-3">
                Connections ({selectedConnections.length})
              </span>
              {selectedConnections.map((connection) => (
                <div className="d-flex flex-column border-bottom py-3">
                  <UserCard
                    user={connection.contact}
                    fontColor="black-500"
                    type={CardType.Contact}
                  />
                  {/* TODO add the connection background here */}
                </div>
              ))}
            </div>
          </Container>
        </Wrapper>
      )}
    </div>
  );
};

export default connector(InmateContainer);
