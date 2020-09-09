import React from "react";
import { Navbar, Nav, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { ReactComponent as Logo } from "src/assets/logo.svg";
import { RootState } from "src/redux";
import { connect, ConnectedProps } from "react-redux";
import { logout } from "src/redux/modules/user";

const mapStateToProps = (state: RootState) => ({
  session: state.session,
});
const mapDispatchToProps = { logout };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const NavBar: React.FC<PropsFromRedux> = ({ session, logout }) => {
  const genLinks = (): JSX.Element => {
    if (!session.staff) return <div />;

    switch (session.staff.role) {
      case "operator":
        return (
          <div className="d-flex flex-row">
            <Nav.Link as={Link} to="/calendar">
              Calendar
            </Nav.Link>
            <Nav.Link as={Link} to="/visitations">
              Live Visitations <span className="badge badge-danger">8</span>
            </Nav.Link>
          </div>
        );
      case "investigator":
        return (
          <Nav.Link as={Link} to="/logs">
            Past Visitations
          </Nav.Link>
        );
      case "supervisor":
      case "admin":
        return (
          <div className="d-flex flex-row">
            <Nav.Link as={Link} to="/calendar">
              Calendar
            </Nav.Link>
            <Nav.Link as={Link} to="/visitations">
              Live Visitations <span className="badge badge-danger">8</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/logs">
              Past Visitations
            </Nav.Link>
            <Nav.Link as={Link} to="/requests">
              <span>
                Requests <span className="badge badge-dark">10</span>
              </span>
            </Nav.Link>

            <Nav.Link as={Link} to="/members">
              Members
            </Nav.Link>
            {/* <Nav.Link as={Link} to="/staff">
              Staff
            </Nav.Link> */}
          </div>
        );
      default:
        return <div />;
    }
  };
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="light"
      variant="light"
      sticky="top"
    >
      <Navbar.Brand>
        <Link to="/">
          <Logo width="150" />
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        {session.staff && (
          <Nav className="ml-auto">
            {genLinks()}

            <Nav.Link onClick={(e: React.MouseEvent) => logout()}>
              <Image
                className="avatar-image"
                src={session.staff.imageUri}
                roundedCircle
              />
            </Nav.Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default connector(NavBar);
