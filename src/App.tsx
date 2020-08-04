import React from "react";
import "./App.css";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./components/navbar/Navbar";

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>{/* <Route path="/login" component={Login}></Route> */}</Switch>
    </Router>
  );
}

export default App;
