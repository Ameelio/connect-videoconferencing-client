import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "src/redux";
import { bindActionCreators, Dispatch } from "redux";
import { selectStaff } from "src/redux/modules/staff";
import Wrapper from "src/components/containers/Wrapper";
import SidebarCard from "src/components/cards/SidebarCard";
import { CardType } from "src/utils/constants";
import Sidebar from "src/components/containers/Sidebar";
import Container from "src/components/containers/Container";
import UserDetailsCard from "src/components/cards/UserDetailsCard";

const mapStateToProps = (state: RootState) => ({
  staff: state.staff.staff,
  selected: state.staff.selectedStaff,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ selectStaff }, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const StaffContainer: React.FC<PropsFromRedux> = ({
  staff,
  selected,
  selectStaff,
}) => {
  return (
    <div className="d-flex flex-row">
      <Sidebar title="Staff members">
        {staff.map((member) => (
          <SidebarCard
            key={member.id}
            type={CardType.Staff}
            entity={member}
            isActive={member.id === selected?.id}
            handleClick={(e) => selectStaff(member)}
          />
        ))}
      </Sidebar>
      {selected && (
        <Wrapper horizontal>
          <Container fluid></Container>
          <Container>
            <UserDetailsCard type={CardType.Staff} user={selected} />
          </Container>
        </Wrapper>
      )}
    </div>
  );
};

export default connector(StaffContainer);
