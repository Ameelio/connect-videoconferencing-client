import React from "react";
import "./App.css";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./components/navbar/Navbar";
import LiveVisitation from "./pages/LiveVisitation";

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path="/" component={LiveVisitation}></Route>
      </Switch>
    </Router>
  );
}

export default App;
