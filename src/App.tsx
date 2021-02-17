import React, { useEffect } from "react";
import "./App.scss";
import { Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import { RootState } from "src/redux";
import { connect, ConnectedProps, useSelector } from "react-redux";
import ProtectedRoute, {
  ProtectedRouteProps,
} from "./components/hocs/ProtectedRoute";
import { loginWithToken } from "./api/Session";
import Menu from "./components/Menu/Menu";
import { Layout } from "antd";
import { logout, setRedirectUrl } from "src/redux/modules/session";
import { Footer } from "antd/lib/layout/layout";
import { fetchFacilities } from "./redux/modules/facility";
import { selectAllFacilities } from "./redux/selectors";
import { selectActiveFacility } from "src/redux/modules/facility";
import { ROUTES } from "./utils/constants";
import { ConnectedRouter } from "connected-react-router";
import { History } from "history";
import { fetchContacts } from "./redux/modules/contact";
import { fetchStaff } from "./redux/modules/staff";
import { fetchInmates } from "./redux/modules/inmate";
import { fetchConnections } from "./redux/modules/connections";
import { fetchNodes } from "./redux/modules/node";
import { fetchKiosks } from "./redux/modules/kiosk";
import { fetchCalls } from "./redux/modules/call";
import { startOfMonth } from "date-fns/esm";
import { endOfMonth } from "date-fns";

const mapStateToProps = (state: RootState) => ({
  session: state.session,
  selected: state.facilities.selected,
  pathname: state.router.location.pathname,
});
const mapDispatchToProps = {
  logout,
  fetchFacilities,
  selectActiveFacility,
  fetchContacts,
  fetchStaff,
  fetchInmates,
  fetchConnections,
  fetchNodes,
  fetchKiosks,
  fetchCalls,
  setRedirectUrl,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const LOGIN_PATH = "/login";

function App({
  session,
  selected,
  pathname,
  selectActiveFacility,
  logout,
  fetchFacilities,
  fetchContacts,
  fetchInmates,
  fetchStaff,
  fetchConnections,
  fetchNodes,
  fetchKiosks,
  fetchCalls,
  setRedirectUrl,
  history,
}: PropsFromRedux & { history: History }) {
  const defaultProtectedRouteProps: ProtectedRouteProps = {
    isAuthenticated: session.isLoggedIn,
    authenticationPath: LOGIN_PATH,
  };

  const facilities = useSelector(selectAllFacilities);

  useEffect(() => {
    // localStorage.setItem("debug", "*");
    localStorage.removeItem("debug");
    (async () => {
      try {
        await loginWithToken();
        await fetchFacilities();
      } catch (err) {}
    })();
  }, [fetchFacilities]);

  useEffect(() => {
    if (session.isLoggedIn) fetchFacilities();
  }, [session.isLoggedIn, fetchFacilities]);

  useEffect(() => {
    if (!session.isLoggedIn && pathname !== LOGIN_PATH)
      setRedirectUrl(pathname);
  }, [setRedirectUrl, session.isLoggedIn, pathname]);

  useEffect(() => {
    if (selected) {
      (async () => {
        await Promise.allSettled([
          fetchContacts(),
          fetchStaff(),
          fetchInmates(),
          fetchConnections(),
          fetchKiosks(),
          fetchNodes(),
        ]);
        fetchCalls({
          startDate: startOfMonth(new Date()).getTime(),
          endDate: endOfMonth(new Date()).getTime(),
        });
      })();
    }
  }, [
    selected,
    fetchContacts,
    fetchStaff,
    fetchConnections,
    fetchInmates,
    fetchNodes,
    fetchCalls,
    fetchKiosks,
  ]);

  return (
    <ConnectedRouter history={history}>
      <Layout style={{ minHeight: "100vh" }}>
        {selected && (
          <Menu
            user={session.user}
            isLoggedIn={session.isLoggedIn}
            logout={logout}
            selected={selected}
            facilities={facilities}
            select={(facility) => selectActiveFacility(facility)}
          />
        )}
        <Layout>
          <Switch>
            <Route exact path={LOGIN_PATH} component={Login}></Route>
            {ROUTES.map((route) => (
              <ProtectedRoute
                exact
                {...defaultProtectedRouteProps}
                path={route.path}
                component={route.component}
                key={route.label}
              ></ProtectedRoute>
            ))}
          </Switch>
          <Footer style={{ textAlign: "center" }}>
            Connect ©2021 Created by Ameelio Inc.
          </Footer>
        </Layout>
      </Layout>
    </ConnectedRouter>
  );
}

export default connector(App);
