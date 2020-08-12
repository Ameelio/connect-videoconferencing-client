import React from "react";
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

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route exact path="/calendar" component={CalendarView}></Route>
        <Route exact path="/requests" component={ConnectionRequests}></Route>
        <Route exact path="/logs" component={Logs}></Route>
        <Route exact path="/staff" component={Staff}></Route>
        <Route exact path="/members" component={Inmate}></Route>
        <Route exact path="/visitations" component={LiveVisitation}></Route>
        <Route exact path="/" component={Dashboard}></Route>
      </Switch>
    </Router>
  );
}

export default App;
