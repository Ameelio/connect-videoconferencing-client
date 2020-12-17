import React, { useEffect } from "react";
import "./App.scss";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./components/headers/Navbar";
import LiveVisitation from "./pages/LiveVisitation";
import CalendarView from "./pages/Calendar";
import ConnectionRequests from "./pages/ConnectionRequests";
import Logs from "./pages/PastVisitations";
import Staff from "./pages/Staff";
import Inmate from "./pages/Inmate";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { RootState } from "src/redux";
import { connect, ConnectedProps } from "react-redux";
import ProtectedRoute, {
  ProtectedRouteProps,
} from "./components/hocs/ProtectedRoute";
import { loginWithToken } from "./api/User";

const mapStateToProps = (state: RootState) => ({
  session: state.session,
});
const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function App({ session }: PropsFromRedux) {
  const defaultProtectedRouteProps: ProtectedRouteProps = {
    isAuthenticated: session.authInfo.apiToken !== "", // TODO: improve this later
    authenticationPath: "/login",
  };

  useEffect(() => {
    localStorage.setItem("debug", "*");

    (async () => {
      try {
        await loginWithToken();
      } catch (err) {}
    })();
  }, []);

  return (
    <Router>
      <NavBar />
      <Switch>
        <Route exact path="/login" component={Login}></Route>
        <ProtectedRoute
          exact
          {...defaultProtectedRouteProps}
          path="/calendar"
          component={CalendarView}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          {...defaultProtectedRouteProps}
          path="/requests"
          component={ConnectionRequests}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          {...defaultProtectedRouteProps}
          path="/logs"
          component={Logs}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          {...defaultProtectedRouteProps}
          path="/staff"
          component={Staff}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          {...defaultProtectedRouteProps}
          path="/members"
          component={Inmate}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          {...defaultProtectedRouteProps}
          path="/visitations"
          component={LiveVisitation}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          {...defaultProtectedRouteProps}
          path="/"
          component={Dashboard}
        ></ProtectedRoute>
      </Switch>
    </Router>
  );
}

export default connector(App);
