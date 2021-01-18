import React, { useEffect, useState } from "react";
import "./App.scss";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import LiveVisitation from "./pages/LiveVisitation";
import CalendarView from "./pages/Calendar";
import ConnectionRequests from "./pages/ConnectionRequests";
import Logs from "./pages/PastVisitations";
import Staff from "./pages/Staff";
import Inmate from "./pages/Inmate";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import { RootState } from "src/redux";
import { connect, ConnectedProps, useSelector } from "react-redux";
import ProtectedRoute, {
  ProtectedRouteProps,
} from "./components/hocs/ProtectedRoute";
import { loginWithToken } from "./api/User";
import Menu from "./components/headers/Menu";
import { Avatar, Layout, PageHeader, Menu as AntdMenu } from "antd";
import { logout } from "src/redux/modules/user";
import { Footer } from "antd/lib/layout/layout";
import { fetchFacilities } from "./redux/modules/facility";
import { selectAllFacilities } from "./redux/selectors";
import { selectActiveFacility } from "src/redux/modules/facility";
import { initializeAppData } from "./api/Common";
// import { useHistory } from "react-router-dom";
import { ROUTES } from "./utils/constants";
import { ConnectedRouter } from "connected-react-router";
import { History } from "history";
import Icon, { BellFilled, BellOutlined, BulbFilled } from "@ant-design/icons";
import { InitialsAvatar } from "./components/avatar/InitialsAvatar";
import { genFullName } from "./utils/utils";

const mapStateToProps = (state: RootState) => ({
  session: state.session,
  selected: state.facilities.selected,
  pathname: state.router.location,
});
const mapDispatchToProps = { logout, fetchFacilities, selectActiveFacility };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const { Header } = Layout;

function App({
  session,
  selected,
  pathname,
  selectActiveFacility,
  logout,
  fetchFacilities,
  history,
}: PropsFromRedux & { history: History }) {
  const defaultProtectedRouteProps: ProtectedRouteProps = {
    isAuthenticated: session.authInfo.apiToken !== "", // TODO: improve this later
    authenticationPath: "/login",
  };

  const facilities = useSelector(selectAllFacilities);
  // const history = useHistory();
  const [header, setHeader] = useState("");

  useEffect(() => {
    // localStorage.setItem("debug", "*");
    localStorage.removeItem("debug");
    (async () => {
      try {
        await loginWithToken();
        await fetchFacilities();
        // await loadData();
      } catch (err) {}
    })();
  }, [fetchFacilities]);

  useEffect(() => {
    if (selected) {
      (async () => await initializeAppData())();
    }
  }, [selected]);

  useEffect(() => {
    const route = ROUTES.find((route) => route.path === pathname.pathname);
    if (route) setHeader(route.label);
  }, [pathname]);

  return (
    <ConnectedRouter history={history}>
      {/* <Header>
        <AntdMenu mode="horizontal" defaultSelectedKeys={['2']}>
          <AntdMenu.Item key="1">nav 1</AntdMenu.Item>
          <AntdMenu.Item key="2">nav 2</AntdMenu.Item>
          <AntdMenu.Item key="3">nav 3</AntdMenu.Item>
        </AntdMenu>
      </Header> */}
      <Layout style={{ minHeight: "100vh" }}>
        {selected && (
          <Menu
            session={session}
            logout={logout}
            selected={selected}
            facilities={facilities}
            select={(facility) => selectActiveFacility(facility)}
          />
        )}
        <Layout>
          <PageHeader
            title={header}
            extra={[
              <BellFilled key="bell" />,
              <BulbFilled key="bulb" />,
              <InitialsAvatar
                name={genFullName(session.user)}
                size="default"
                shape="circle"
                key="avatar"
              />,
            ]}
          />
          <Switch>
            <Route exact path="/login" component={Login}></Route>
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
