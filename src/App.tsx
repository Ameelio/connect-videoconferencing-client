import React from "react";
import "./App.css";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./components/navbar/Navbar";
import LiveVisitation from "./pages/LiveVisitation";
import CalendarView from "./pages/Calendar";

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route exact path="/calendar" component={CalendarView}></Route>
        <Route exact path="/" component={LiveVisitation}></Route>
      </Switch>
    </Router>
  );
}

export default App;
