import React from "react";
import "./App.scss";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./components/navbar/Navbar";
import LiveVisitation from "./pages/LiveVisitation";
import CalendarView from "./pages/Calendar";
import ConnectionRequests from "./pages/ConnectionRequests";
import Logs from "./pages/PastVisitations";

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route exact path="/calendar" component={CalendarView}></Route>
        <Route exact path="/requests" component={ConnectionRequests}></Route>
        <Route exact path="/logs" component={Logs}></Route>
        <Route exact path="/" component={LiveVisitation}></Route>
      </Switch>
    </Router>
  );
}

export default App;
