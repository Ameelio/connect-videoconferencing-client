import React, { useEffect, useState } from "react";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import { useAppDispatch, useAppSelector } from "src/redux";
import { useSelector } from "react-redux";
import ProtectedRoute, {
  ProtectedRouteProps,
} from "./components/hocs/ProtectedRoute";
import Menu from "./components/Menu/Menu";
import { Layout, Spin } from "antd";
import { logout, setRedirectUrl } from "src/redux/modules/session";
import { fetchFacilities } from "./redux/modules/facility";
import { selectAllFacilities } from "./redux/selectors";
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
import { useCallCountWithStatus, useCallsWithStatus } from "./hooks/useCalls";
import Modals from "./components/Modals";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

const LOGIN_PATH = "/login";

const Loader = () => (
  <div className="flex h-screen w-screen">
    <Spin size="large" className="m-auto" tip={"Loading workpace..."} />
  </div>
);

function App({ history }: { history: History }) {
  const session = useAppSelector((state) => state.session);
  const selected = useAppSelector((state) => state.facilities.selected);
  const pathname = useAppSelector((state) => state.router.location.pathname);
  const liveCallsCount = useCallsWithStatus("live").length;
  const dispatch = useAppDispatch();

  const [isAuthenticated, setIsAuthenticated] = useState(
    session.status === "active"
  );
  const [isInitingData, setIsInitingData] = useState(true);

  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    release: "connect-client@" + process.env.npm_package_version,
    tracesSampleRate: 1.0,
  });

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
    if (isAuthenticated) dispatch(fetchFacilities());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!isAuthenticated && pathname !== LOGIN_PATH)
      dispatch(setRedirectUrl(pathname));
  }, [dispatch, isAuthenticated, pathname]);

  useEffect(() => {
    if (selected) {
      setIsInitingData(true);
      // TODO: this initialization strategy doesn't actually work - dispatch doesnt await for the API call results
      // kinda works but for the wrong reasons (wont work for slower API resposes)
      // https://github.com/Ameelio/connect-doc-client/issues/74
      (async () => {
        await Promise.allSettled([
          dispatch(fetchContacts()),
          dispatch(fetchStaff()),
          dispatch(fetchInmates()),
          dispatch(fetchConnections()),
          dispatch(fetchKiosks()),
          dispatch(fetchGroups()),
          dispatch(
            fetchCalls({
              scheduledStart: {
                rangeStart: startOfMonth(new Date()).getTime(),
                rangeEnd: endOfMonth(new Date()).getTime(),
              },
              limit: 500,
            })
          ),
        ]);
      })().then(() => setIsInitingData(false));
    }
  }, [selected, dispatch]);

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
      <Modals />
    </ConnectedRouter>
  );
}

export default App;
