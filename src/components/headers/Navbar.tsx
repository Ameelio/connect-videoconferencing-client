import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { ReactComponent as Logo } from "src/assets/logo.svg";

interface Props {}

const NavBar: React.FC<Props> = () => {
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
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/calendar">
            Calendar
          </Nav.Link>
          <Nav.Link as={Link} to="/visitations">
            Live Visitations <span className="badge badge-danger">8</span>
          </Nav.Link>

          <Nav.Link as={Link} to="/requests">
            <span>
              Requests <span className="badge badge-dark">10</span>
            </span>
          </Nav.Link>
          <Nav.Link as={Link} to="/logs">
            Past Visitations
          </Nav.Link>
          <Nav.Link as={Link} to="/members">
            Members
          </Nav.Link>
          <Nav.Link as={Link} to="/staff">
            Staff
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
