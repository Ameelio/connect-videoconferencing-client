import React, { useState, ReactElement } from "react";
import { RootState } from "src/redux";
import { connect, ConnectedProps } from "react-redux";
import { setSession } from "src/redux/modules/user";

import { Form, Button } from "react-bootstrap";
import Container from "src/components/containers/Container";
// import { ReactComponent as Operator } from "src/assets/avatars/bald.svg";
// import { ReactComponent as Supervisor } from "src/assets/avatars/woman.svg";
// import { ReactComponent as Admin } from "src/assets/avatars/professor.svg";
// import { ReactComponent as Investigator } from "src/assets/avatars/investigator.svg";
// import { OPERATOR, SUPERVISOR, ADMIN, INVESTIGATOR } from "src/data/sample";

import "./index.css";
import { Redirect } from "react-router";
import { loginWithCredentials } from "src/api/User";

const mapStateToProps = (state: RootState) => ({
  session: state.session,
});

const mapDispatchToProps = { setSession };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function LoginContainer({ session, setSession }: PropsFromRedux): ReactElement {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const tryLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    const cred: UserLoginInfo = {
      email,
      password,
      remember: false,
    };
    try {
      const userState = await loginWithCredentials(cred);
      setSession(userState);
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  if (session.isLoggedIn) return <Redirect to="/" />;

  return (
    <section className="login-form m-auto ">
      <Container>
        <div className="d-flex flex-column">
          <span className="p2 font-weight-lighter mb-3">Welcome Back!</span>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={error !== ""}
              />
              <Form.Control.Feedback type="invalid">
                {error}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={error !== ""}
              />
            </Form.Group>
            <Button block type="submit" onClick={tryLogin}>
              Login
            </Button>
          </Form>
          <span className="p6 black-500 mt-3">
            {" "}
            Don't have an account? Select one of the test accounts below:
          </span>
          {/* <div className="d-flex flex-row  justify-content-between mt-3">
            <div
              className="px-2 py-3 border rounded d-flex flex-column align-items-center test-account-card"
              onClick={(e) => login(OPERATOR)}
            >
              <Operator width="90" />
              <span className="p6 mt-2">Bart</span>
              <span className="p7 font-weight-light">OPERATOR</span>
            </div>
            <div
              className="px-2 py-3 border rounded d-flex flex-column align-items-center test-account-card"
              onClick={(e) => login(INVESTIGATOR)}
            >
              <Investigator width="90" />
              <span className="p6 mt-2">Shannon</span>
              <span className="p7 font-weight-light">INVESTIGATOR</span>
            </div>
            <div
              className="px-2 py-3 border rounded d-flex flex-column align-items-center test-account-card"
              onClick={(e) => login(SUPERVISOR)}
            >
              <Supervisor width="90" />
              <span className="p6 mt-2">Amber</span>
              <span className="p7 font-weight-light">SUPERVISOR</span>
            </div>
            <div
              className="px-2 py-3 border rounded d-flex flex-column align-items-center test-account-card"
              onClick={(e) => login(ADMIN)}
            >
              <Admin width="90" />
              <span className="p6 mt-2">Chris</span>
              <span className="p7 font-weight-light">ADMIN</span>
            </div>
          </div> */}
        </div>
      </Container>
    </section>
  );
}

export default connector(LoginContainer);
