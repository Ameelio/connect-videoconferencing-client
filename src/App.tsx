import React, { useEffect, useState } from "react";
import "./App.scss";
import { Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import { RootState } from "src/redux";
import { connect, ConnectedProps, useSelector } from "react-redux";
import ProtectedRoute, {
  ProtectedRouteProps,
} from "./components/hocs/ProtectedRoute";
import Menu from "./components/Menu/Menu";
import { Layout, Spin } from "antd";
import { logout, setRedirectUrl } from "src/redux/modules/session";
import { fetchFacilities } from "./redux/modules/facility";
import { selectAllFacilities, selectLiveCalls } from "./redux/selectors";
import { selectActiveFacility } from "src/redux/modules/facility";
import { ROUTES } from "./constants";
import { ConnectedRouter } from "connected-react-router";
import { History } from "history";
import { fetchContacts } from "./redux/modules/contact";
import { fetchStaff } from "./redux/modules/staff";
import { fetchInmates } from "./redux/modules/inmate";
import { fetchConnections } from "./redux/modules/connections";
import { fetchGroups } from "./redux/modules/group";
import { fetchKiosks } from "./redux/modules/kiosk";
import { fetchCalls } from "./redux/modules/call";
import { startOfMonth } from "date-fns/esm";
import { endOfMonth } from "date-fns";
import { Facility } from "./typings/Facility";
import { useConnectionRequestsCount } from "./hooks/useConnections";
import { useCallCountWithStatus } from "./hooks/useCalls";

const mapStateToProps = (state: RootState) => ({
  session: state.session,
  selected: state.facilities.selected,
  pathname: state.router.location.pathname,
  liveCallsCount: selectLiveCalls(state).length,
});
const mapDispatchToProps = {
  logout,
  fetchFacilities,
  selectActiveFacility,
  fetchContacts,
  fetchStaff,
  fetchInmates,
  fetchConnections,
  fetchGroups,
  fetchKiosks,
  fetchCalls,
  setRedirectUrl,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const LOGIN_PATH = "/login";

const Loader = () => (
  <div className="d-flex vh-100 vw-100">
    <Spin size="large" className="m-auto" tip={"Loading workpace..."} />
  </div>
);

function App({
  session,
  selected,
  pathname,
  liveCallsCount,
  selectActiveFacility,
  logout,
  fetchFacilities,
  fetchContacts,
  fetchInmates,
  fetchStaff,
  fetchConnections,
  fetchGroups,
  fetchKiosks,
  fetchCalls,
  setRedirectUrl,
  history,
}: PropsFromRedux & { history: History }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    session.status === "active"
  );
  const [isInitingData, setIsInitingData] = useState(true);

  const requestsCount = useConnectionRequestsCount();
  const pendingCallsCount = useCallCountWithStatus("pending_approval");

  useEffect(() => setIsAuthenticated(session.status === "active"), [
    session.status,
  ]);

  const defaultProtectedRouteProps: ProtectedRouteProps = {
    isAuthenticated,
    authenticationPath: LOGIN_PATH,
  };

  const facilities = useSelector(selectAllFacilities);

  useEffect(() => {
    // localStorage.setItem("debug", "*");
    localStorage.removeItem("debug");
    (async () => {
      try {
        await fetchFacilities();
      } catch (err) {}
    })();
  }, [fetchFacilities]);

  useEffect(() => {
    if (isAuthenticated) fetchFacilities();
  }, [isAuthenticated, fetchFacilities]);

  useEffect(() => {
    if (!isAuthenticated && pathname !== LOGIN_PATH) setRedirectUrl(pathname);
  }, [setRedirectUrl, isAuthenticated, pathname]);

  useEffect(() => {
    if (selected) {
      setIsInitingData(true);
      (async () => {
        await Promise.allSettled([
          fetchContacts(),
          fetchStaff(),
          fetchInmates(),
          fetchConnections(),
          fetchKiosks(),
          fetchGroups(),
        ]);
        fetchCalls({
          scheduledStart: {
            rangeStart: startOfMonth(new Date()).getTime(),
            rangeEnd: endOfMonth(new Date()).getTime(),
          },
        });
      })().then(() => setIsInitingData(false));
    }
  }, [
    selected,
    fetchContacts,
    fetchStaff,
    fetchConnections,
    fetchInmates,
    fetchGroups,
    fetchCalls,
    fetchKiosks,
  ]);

  return (
    <ConnectedRouter history={history}>
      <Layout style={{ minHeight: "100vh" }}>
        {selected && (
          <Menu
            user={session.user}
            isLoggedIn={isAuthenticated}
            logout={logout}
            selected={selected}
            facilities={facilities}
            select={(facility: Facility) => selectActiveFacility(facility)}
            liveCallsCount={liveCallsCount}
            requestsCount={requestsCount}
            callRequestsCount={pendingCallsCount}
          />
        )}
        <Layout>
          {(isInitingData && isAuthenticated) ||
          session.status === "loading" ? (
            <Loader />
          ) : (
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
          )}
        </Layout>
      </Layout>
    </ConnectedRouter>
  );
}

export default connector(App);
