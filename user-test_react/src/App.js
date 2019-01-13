import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import React, { Component } from "react";
import NavegadorBarra from "./componentes/NavegadorBarra";
import Login from "./componentes/Login";
import SignUp from "./componentes/SignUp";
import Me from "./componentes/Me";
import store from "./store";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <NavegadorBarra />
            <Route exact path="/" component={Login} />
            <Route exact path="/signin" component={Login} />
            <Route exact path="/me" component={Me} />
            <Route exact path="/signup" component={SignUp} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
